import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import Footer from './Footer';

// Skeleton Loader Component with custom animation
const MedicineCardSkeleton = ({ count = 1 }) => {
  // Inline style for custom animation duration
  const skeletonStyle = {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      {[...Array(count)].map((_, index) => (
        <div 
          key={index} 
          className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          style={skeletonStyle}
        >
          {/* Image Skeleton */}
          <div className="h-48 bg-gray-200"></div>
          
          <div className="p-6 flex flex-col h-full">
            {/* Category Skeleton */}
            <div className="h-6 w-24 bg-gray-200 rounded-full mb-3"></div>
            
            {/* Title Skeleton */}
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            
            {/* Details Skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            
            {/* Description Skeleton */}
            <div className="flex-grow space-y-2 mb-4">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
            
            {/* Price and Button Skeleton */}
            <div className="border-t pt-4 mt-auto">
              <div className="flex items-center justify-between">
                <div className="w-24 h-8 bg-gray-200 rounded"></div>
                <div className="w-24 h-10 bg-gray-200 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ITEMS_PER_PAGE = 100;

function Medicines() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Handle add to cart with quantity
  const handleAddToCart = (medicine, qty = 1) => {
    addToCart({ ...medicine, quantity: qty });
    setSelectedMedicine(null);
    setQuantity(1);
    toast.success(`${qty} ${qty > 1 ? 'items' : 'item'} of ${medicine.name} added to cart`, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0 && value <= 100) {
      setQuantity(value);
    }
  };

  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: ''
  });
  const [categories, setCategories] = useState([]);

  // Fetch medicines and extract categories
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        console.log('Fetching medicines from API...');
        const { data } = await axios.get(`http://localhost:4000/api/medicines?page=${page}&limit=${ITEMS_PER_PAGE}`);
        console.log('API Response:', data);
        
        if (data && data.data && data.data.length > 0) {
          console.log('First medicine in response:', data.data[0]);
          
          // Extract unique categories from the current page
          const uniqueCategories = [...new Set(
            data.data
              .map(medicine => medicine.category)
              .filter(Boolean) // Remove null/undefined categories
          )];
          
          setCategories(prevCategories => {
            // Merge with existing categories and remove duplicates
            const merged = [...new Set([...prevCategories, ...uniqueCategories])];
            return merged.sort();
          });
          
          setMedicines(data.data);
          setFilteredMedicines(data.data); // Initially, filtered medicines are the same as all medicines
        } else {
          setMedicines([]);
          setFilteredMedicines([]);
        }
        
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('Error fetching medicines:', err);
        setError(err.message || 'An unexpected error occurred');
        setMedicines([]);
        setFilteredMedicines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [page]);

  // Apply search and filters
  useEffect(() => {
    let results = [...medicines];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(medicine => 
        (medicine.name && medicine.name.toLowerCase().includes(term)) ||
        (medicine.brand && medicine.brand.toLowerCase().includes(term)) ||
        (medicine.description && medicine.description.toLowerCase().includes(term)) ||
        (medicine.company && medicine.company.toLowerCase().includes(term))
      );
    }
    
    // Apply category filter
    if (filters.category) {
      results = results.filter(medicine => 
        medicine.category && medicine.category === filters.category
      );
    }
    
    setFilteredMedicines(results);
  }, [searchTerm, filters, medicines]);
  
  // Handlers for search and filters
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on new search
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1); // Reset to first page on filter change
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      category: ''
    });
    setPage(1);
  };
  
  const handlePrev = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setPage((prev) => Math.min(totalPages, prev + 1));

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow py-8 w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 max-w-4xl mx-auto">
              <div className="h-12 bg-gray-200 rounded-full w-1/3 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
            <div className="w-full">
              <MedicineCardSkeleton count={8} />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow py-8 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Explore Our <span style={{ color: '#1c7856' }}>Medicine</span> Collection
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4 mb-8">
              Discover high-quality healthcare solutions for you and your family
            </p>
            
            {/* Search and Filter Bar */}
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow max-w-2xl">
                  <input
                    type="text"
                    placeholder="Search medicines..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1c7856] focus:border-transparent"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <span className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                </div>
                
                <div className="w-full sm:w-48">
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1c7856] focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Active Filters */}
              {(searchTerm || filters.category) && (
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {searchTerm && (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full flex items-center">
                      Search: {searchTerm}
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="ml-1.5 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.category && (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full flex items-center">
                      Category: {filters.category}
                      <button 
                        onClick={() => handleFilterChange({ target: { name: 'category', value: '' } })}
                        className="ml-1.5 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  <button 
                    onClick={resetFilters}
                    className="ml-2 text-sm text-[#1c7856] hover:text-[#156349] font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {error ? (
            <div className="text-center py-10">
              <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-md">
                <span>Error: {error}</span>
              </div>
            </div>
          ) : filteredMedicines.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No medicines found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {searchTerm || filters.category
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No medicines are currently available.'}
              </p>
              {(searchTerm || filters.category) && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#1c7856] text-white rounded-md hover:bg-[#156349] transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredMedicines.length} {filteredMedicines.length === 1 ? 'result' : 'results'}
                {(searchTerm || filters.category) && (
                  <span className="text-gray-400 ml-2">(filtered from {medicines.length} total)</span>
                )}
              </div>
              
              {/* Medicines Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                {filteredMedicines.map((medicine) => (
                  <div
                    key={medicine._id?.$oid}
                    className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition duration-200 flex flex-col h-full w-full"
                  >
                    {/* Placeholder Image */}
                    {/* Medicine Image */}
                    <div className="h-48 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center p-4">
                      <svg className="h-20 w-20 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>

                    <div className="p-6 flex flex-col h-full">
                      {/* Category */}
                      <div className="min-h-[24px] mb-3">
                        {medicine.category && (
                          <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                            {medicine.category}
                          </span>
                        )}
                      </div>

                      {/* Medicine Name */}
                      <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight" title={medicine.name}>
                        {medicine.name}
                      </h3>

                      {/* Medicine Details */}
                      <div className="space-y-2 text-sm text-gray-700 mb-4">
                        {medicine.brand && (
                          <p className="truncate">
                            <span className="font-medium">Brand:</span> {medicine.brand}
                          </p>
                        )}
                        {medicine.company && (
                          <p className="truncate">
                            <span className="font-medium">Company:</span> {medicine.company}
                          </p>
                        )}
                        {medicine.quantity && (
                          <p>
                            <span className="font-medium">Package:</span> {medicine.quantity}
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      <div className="mb-4 flex-grow">
                        {medicine.description ? (
                          <p className="text-sm text-gray-600 line-clamp-3" title={medicine.description}>
                            {medicine.description}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-400 italic">No description available</p>
                        )}
                      </div>

                      {/* Price and Action */}
                      <div className="border-t pt-4 mt-3">
                        <div className="flex flex-col space-y-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-xs text-gray-500 block">Starting at</span>
                              <p className="text-xl font-bold text-[#1c7856]">
                                {String(medicine.price).startsWith('₹') ? medicine.price : `₹${medicine.price}`}
                              </p>
                            </div>
                          </div>
                          <div className="w-full">
                            {selectedMedicine?._id === medicine._id ? (
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setQuantity(prev => Math.max(1, prev - 1));
                                    }}
                                    className="w-7 h-7 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    className="w-10 text-center border-x border-gray-300 h-7 text-sm focus:outline-none focus:ring-1 focus:ring-[#1c7856]"
                                  />
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setQuantity(prev => Math.min(100, prev + 1));
                                    }}
                                    className="w-7 h-7 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm"
                                  >
                                    +
                                  </button>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(medicine, quantity);
                                  }}
                                  className="flex-1 bg-[#1c7856] hover:bg-[#156349] text-white py-1.5 px-2 rounded-md text-xs font-medium transition-colors duration-200 flex items-center justify-center gap-1 whitespace-nowrap"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zm13 15.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                  </svg>
                                  Add to Cart
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedMedicine(medicine);
                                  setQuantity(1);
                                }}
                                className="w-auto min-w-[120px] bg-[#1c7856] hover:bg-[#156349] text-white py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zm13 15.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                </svg>
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {medicine.prescriptionRequired && (
                      <div className="px-4 py-2 bg-yellow-50 text-center text-yellow-800 text-xs font-medium">
                        <span>Prescription Required</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center mt-10 space-x-4">
                <button 
                  className={`px-5 py-2 rounded-md font-medium transition-colors ${
                    page === 1 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-[#1c7856] text-white hover:bg-[#156349]'
                  }`}
                  disabled={page === 1} 
                  onClick={handlePrev}
                >
                  Prev
                </button>
                <span className="font-medium text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button 
                  className={`px-5 py-2 rounded-md font-medium transition-colors ${
                    page === totalPages 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-[#1c7856] text-white hover:bg-[#156349]'
                  }`}
                  disabled={page === totalPages} 
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Medicines;
