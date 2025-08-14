# MedLinkPlus: Full-Stack Healthcare Application

MedLinkPlus is a comprehensive healthcare platform designed to connect patients, doctors, and administrators. It features a user-friendly interface for patients to book appointments and consult with doctors, an administrative dashboard for management, and a robust backend to handle the application's logic and data.

## Project Structure

The project is organized into three main parts: a React-based frontend for users, a separate React-based admin panel, and a Node.js/Express backend.

```
MedlinkPlus/
├── Backend/             # Node.js/Express API
├── Frontend/medlinkplus/  # React User-Facing App (Vite)
├── admin/               # React Admin Panel (Vite)
├── assets/              # Shared static assets
├── Pharmacist.Medicines.json # Medicine data
└── Updated_Medicines.json  # Updated medicine data
```

### Backend (`/Backend`)

The backend is built with Node.js and Express, using MongoDB as the database. It handles all business logic, API endpoints, and data management.

- **`server.js`**: The main entry point for the backend server.
- **`config/`**: Contains database connection and other configuration files.
- **`controllers/`**: Holds the business logic for different parts of the application (e.g., user authentication, appointment handling).
- **`middleware/`**: Includes custom middleware for tasks like authentication (`auth.js`, `authD.js`) and error handling.
- **`models/`**: Defines the Mongoose schemas for the MongoDB database (e.g., `userModel.js`, `doctorModel.js`, `orderModel.js`).
- **`routes/`**: Contains the API route definitions that link endpoints to controller logic.
- **`scripts/`**: Utility scripts, potentially for database seeding or other tasks.

### Frontend (`/Frontend/medlinkplus`)

The main user-facing application is a single-page application built with React and Vite.

- **`src/main.jsx`**: The entry point for the React application.
- **`src/App.jsx`**: The root component of the application, which sets up routing.
- **`src/components/`**: Contains reusable UI components used throughout the application.
- **`src/pages/`**: Includes components that represent full pages (e.g., Home, Login, Profile).
- **`src/context/`**: Holds React Context providers for state management (e.g., `CartContext`).

### Admin Panel (`/admin`)

The admin panel is a separate React application, also built with Vite, for administrative tasks.

- **`src/App.jsx`**: The root component for the admin panel.
- **`src/pages/`**: Contains pages specific to administrative functions (e.g., user management, doctor approvals).
- **`src/components/`**: UI components specific to the admin panel.

## Getting Started

To run this project locally, you will need to run the backend server and the frontend applications separately.

**1. Run the Backend:**
```bash
cd Backend
npm install
npm start
```

**2. Run the Frontend:**
```bash
cd Frontend/medlinkplus
npm install
npm run dev
```

**3. Run the Admin Panel:**
```bash
cd admin
npm install
npm run dev
```
