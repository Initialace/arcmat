import api from '@/lib/api';

const authService = {
    register: async (userData) => {
        const payload = {
            name: userData.name.trim(),
            email: userData.email.toLowerCase(),
            mobile: Number(userData.mobile),
            password: userData.password,
            profile: userData.profile || '',
            role: userData.role,
            profession: userData.profession,
            city: userData.city
        };

        const response = await api.post('/user/register', payload);
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/user/login', credentials);
        return response.data;
    },

    getUserInfo: async () => {
        const response = await api.get('/user/userinfo');
        return response.data;
    },

    logout: async () => {
        return { success: true };
    }
};

export default authService;
