import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';



// Get the project root directory using absolute path
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, '..', '..', 'Updated_Medicines.json');
console.log('Looking for JSON file at:', jsonPath);

// Read medicines once and cache them
let cachedMedicines = null;

const readMedicines = async () => {
  if (cachedMedicines) return cachedMedicines;
  try {
    const medicines = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    cachedMedicines = medicines;
    return medicines;
  } catch (error) {
    console.error('Error reading medicines file:', error);
    throw error;
  }
};

// Export both functions as an object to avoid duplicate declarations
// simple in-memory cache for online data by medicine id

export const medicinesController = {
  onlineCache: {},
  async getMedicines(req, res) {
    try {
      const page = parseInt(req.query.page, 10) || 1; // 1-based index
      const limit = parseInt(req.query.limit, 10) || 100;
      const medicines = await readMedicines();

      const start = (page - 1) * limit;
      const end = start + limit;
      const paginated = medicines.slice(start, end);

      res.json({
        data: paginated,
        page,
        limit,
        totalItems: medicines.length,
        totalPages: Math.ceil(medicines.length / limit),
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching medicines', error: error.message });
    }
  },

  async getMedicineById(req, res) {
    try {
      const medicines = await readMedicines();
      const medicine = medicines.find(m => m._id.$oid === req.params.id);
      
      if (!medicine) {
        return res.status(404).json({ message: 'Medicine not found' });
      }
      
      res.json(medicine);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching medicine', error: error.message });
    }
  },

  // Fetch extra description from OpenFDA and cache it (on-demand)
  async getMedicineOnline(req, res) {
    const id = req.params.id;
        if (this.onlineCache[id]) {
      return res.json(this.onlineCache[id]);
    }
    try {
      const medicines = await readMedicines();
      const medicine = medicines.find(m => m._id.$oid === id);
      if (!medicine) {
        return res.status(404).json({ message: 'Medicine not found' });
      }
      const searchTerm = encodeURIComponent(medicine.name.split(' ')[0]);
      const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name.exact:"${searchTerm}"&limit=1`;
      console.log(`Fetching from OpenFDA: ${url}`);
      const fetchModule = await import('node-fetch');
      const fetch = fetchModule.default;
      const response = await fetch(url);
            let first = {};
      if (response.ok) {
        const data = await response.json();
        first = (data.results && data.results[0]) || {};
      } else if (response.status !== 404) {
        const errorBody = await response.text();
        console.error(`OpenFDA request failed with status ${response.status}:`, errorBody);
        throw new Error(`OpenFDA fetch failed with status: ${response.status}`);
      }
      
      const details = {
        id,
        name: medicine.name,
        category: medicine.category,
        description: (first.description && first.description[0]) || medicine.description || 'No description available',
        indications: (first.indications_and_usage && first.indications_and_usage[0]) || null,
        image: (first.spl_image && first.spl_image[0]) || null,
      };
      this.onlineCache[id] = details;
      res.json(details);
    } catch (error) {
      console.error('getMedicineOnline error', error);
      res.status(500).json({ message: 'Error fetching online data', error: error.message });
    }
  }
};
