// Centralized API configuration for ScholarSwarm
// In development: defaults to http://localhost:8000
// In production: uses VITE_API_URL set in Vercel / Render / Railway dashboard
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:8000' : '')
).replace(/\/+$/, '');
