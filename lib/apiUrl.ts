// Base URL of the Express backend (backend/). Falls back to the local dev
// port since most teammates won't have NEXT_PUBLIC_API_URL set yet.
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
