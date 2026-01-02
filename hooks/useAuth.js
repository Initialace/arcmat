import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import authService from '@/services/authService';
import useAuthStore from '@/store/useAuthStore';

import { useLoader } from '@/context/LoaderContext';

const setAuthState = (userData, token) => {
    if (token) {
        const user = userData.data || userData;
        Cookies.set('token', token, { expires: 7 });
        Cookies.set('role', user?.role, { expires: 7 });
        Cookies.set('email', user?.email, { expires: 7 });
        Cookies.set('name', user?.name, { expires: 7 });
        localStorage.setItem('user', JSON.stringify(user));

        // CRITICAL: Sync with Zustand store
        useAuthStore.getState().login(user, token);
        console.log('Auth synced - User:', user, 'Token:', token);
    }
};

const clearAuthState = () => {
    Cookies.remove('token');
    Cookies.remove('role');
    Cookies.remove('email');
    Cookies.remove('name');
    localStorage.removeItem('user');
    localStorage.removeItem('user_details');

    // CRITICAL: Sync logout with Zustand store
    useAuthStore.getState().logout();
};

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoadingState] = useState(true);
    const router = useRouter();
    const { setLoading } = useLoader();

    useEffect(() => {
        const token = Cookies.get('token');
        const storedUser = localStorage.getItem('user');
        const storedUserDetails = localStorage.getItem('user_details');

        const fetchUserInfo = async () => {
            try {
                const userInfo = await authService.getUserInfo();
                const userUpdate = userInfo.data || userInfo;
                localStorage.setItem('user_details', JSON.stringify(userUpdate));
                setUser(userUpdate);

                // CRITICAL: Sync with Zustand store
                useAuthStore.getState().login(userUpdate, token);
                console.log('User info fetched and synced:', userUpdate);
            } catch (error) {
                console.error("Failed to fetch user info on page load:", error);
            }
        };

        if (token && (storedUser || storedUserDetails)) {
            try {
                const initialUser = storedUserDetails ? JSON.parse(storedUserDetails) : JSON.parse(storedUser);
                setUser(initialUser);
                setIsAuthenticated(true);

                // CRITICAL: Sync with Zustand store immediately
                useAuthStore.getState().login(initialUser, token);
                console.log('Initial user synced from storage:', initialUser);

                fetchUserInfo();
            } catch (error) {
                console.error('Error parsing user data from localStorage', error);
                clearAuthState();
            }
        } else {
            setUser(null);
            setIsAuthenticated(false);
        }
        setLoadingState(false);
    }, []);

    const logout = () => {
        setLoading(true);
        clearAuthState();
        setUser(null);
        setIsAuthenticated(false);
        router.push('/auth/login');
    };

    return { user, isAuthenticated, loading, logout };
};

export const useRegisterMutation = () => {
    const router = useRouter();
    const { setLoading } = useLoader();

    return useMutation({
        mutationFn: (userData) => authService.register(userData),
        onSuccess: (data) => {
            const newUser = data.data;
            setAuthState(newUser, data.token);

            const role = newUser?.role;
            if (role === 'vendor') {
                setLoading(true);
                router.push('/dashboard');
            } else {
                setLoading(true);
                router.push('/');
            }
        },
        onError: (error) => {
            console.error('Registration failed:', error);
        }
    });
};

export const useLoginMutation = () => {
    const router = useRouter();
    const { setLoading } = useLoader();

    return useMutation({
        mutationFn: (credentials) => authService.login(credentials),
        onSuccess: async (data, variables) => {
            const user = data.user || {
                email: variables.email,
                name: variables.email.split('@')[0],
                role: data.role
            };

            setAuthState(user, data.token);

            let finalRole = user?.role;

            try {
                const userInfo = await authService.getUserInfo();
                const userUpdate = userInfo.data || userInfo;
                localStorage.setItem('user_details', JSON.stringify(userUpdate));
                finalRole = userUpdate.role || finalRole;
            } catch (error) {
                console.error("Failed to fetch user info on login:", error);
            }

            if (finalRole === 'vendor') {
                setLoading(true);
                router.push('/dashboard');
            } else {
                setLoading(true);
                router.push('/');
            }
        },
        onError: (error) => {
            console.error('Login failed:', error);
        }
    });
};
