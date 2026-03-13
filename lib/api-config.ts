/**
 * Centralized API configuration for the BFF proxy.
 * Resolves the backend URL with priority:
 * 1. BACKEND_URL (private server-side variable)
 * 2. NEXT_PUBLIC_API_URL (public variable used as fallback)
 * 3. Localhost fallback
 */
export const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
