import axios from "axios";

const api = axios.create({
    baseURL: "https://arcmat-api.vercel.app/api/user/",
});

// Request interceptor to add the auth token header to requests
api.interceptors.request.use(
    (config) => {
        // Attempt to get token from cookie
        let token = null;
        if (typeof document !== 'undefined') {
            const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
            if (match) token = match[2];
        }

        // Fallback to localStorage if not in cookie (for backward compatibility during dev)
        if (!token && typeof localStorage !== 'undefined') {
            token = localStorage.getItem('token');
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;