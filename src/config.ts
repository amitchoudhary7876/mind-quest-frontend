
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003';

// For sockets, we usually want the base URL without /api if it serves both.
// If API_URL is http://localhost:3000/api, we might need to strip /api.
// But usually for local dev it's http://localhost:3000.
// Let's assume API_URL is the host base.

export const getSocketUrl = () => {
    return API_URL;
};
