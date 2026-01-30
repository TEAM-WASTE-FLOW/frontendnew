import axios from 'axios';

// const API_URL = 'http://localhost:3000/api';
const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include auth token if we implement auth later
api.interceptors.request.use((config) => {
    // For now, we are bypassing auth as per the plan
    return config;
});

export const analyticsService = {
    getAnalytics: async () => {
        const response = await api.get('/analytics');
        return response.data;
    },
};

export const wasteService = {
    submitWaste: async (formData: FormData) => {
        const response = await api.post('/submit-waste', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
