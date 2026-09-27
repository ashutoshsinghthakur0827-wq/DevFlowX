const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://devflowx-zmlo.onrender.com/api";

const FASTAPI_URL =
  import.meta.env.VITE_FASTAPI_URL ||
  "https://devflowx-fastapi.onrender.com";


// Named exports
export {
  API_URL,
  FASTAPI_URL
};


// Default export
// Keeps compatibility with existing components
export default API_URL;
