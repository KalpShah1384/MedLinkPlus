// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export { API_BASE_URL, BACKEND_URL };

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
    return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// Helper function to get backend URL
export const getBackendUrl = (path = '') => {
    return `${BACKEND_URL}${path.startsWith('/') ? path : `/${path}`}`;
};
