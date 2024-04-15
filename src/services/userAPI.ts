// services/usersAPI.ts
import { NewUserData } from 'src/interfaces/NewUserData.interface';
import api from './api';
import Cookies from 'js-cookie';


export const fetchAllSuppliers = async () => {
    try {
        const response = await api.get('/supplier');
        console.log("SUPP", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching all requests:", error.message);
        throw error;
    }
};

export const getUserById = async (userId: string) => {
    console.log(userId);
    try {
        const response = await api.get('/user/' + userId);
        return response.data;
    } catch (error) {
        console.error("Error fetching the user", error.message);
        throw error;
    }
};

export const fetchAllUsers = async (_token: string) => {
    try {
        const token = _token; // Replace with the actual token

        const response = await api.get('/user', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching all users:", error.message);
        throw error;
    }
};


export const createUser = async (data: any) => {
    try {
        const response = await api.post('/auth/register', data);
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error.message);
        throw error;
    }
};


export const loginUser = async (data: { email: string; password: string }) => {
    try {
        const response = await api.post('/auth/login', data);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

export const recoverAccount = async (data: { email: string }) => {
    try {
        const response = await api.post('/auth/send-reset-token', data);
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

export const sendRecoverCode = async (data: { resetToken: string, newPassword: string }) => {
    try {
        const response = await api.post('/auth/reset-password', data);
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};
export const logout = () => {
    try {
        // Remove the token cookie
        Cookies.remove('token');

    } catch (error) {
        console.error("Error during logout:", error.message);
        throw error;
    }
};

export const checkAuth = async (data: { token: string }) => {
    try {
        const response = await api.post('/auth/check-auth', data);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error.message);
        throw error;
    }
};

export const generateMnemonic = async () => {
    try {
        const response = await api.get('/users/generate-mnemonic');
        return response.data;
    } catch (error) {
        console.error("Error getting mnemonic in:", error.message);
        throw error;
    }
};

export const requestOTP = async (data: { token: string }) => {
    try {
        const response = await api.post('/auth/send-otp', data);
        return response.data;
    } catch (error) {
        console.error("Error sending OTP in:", error.message);
        throw error;
    }
};

export const verifyOTP = async (data: { token: string; otp: string }) => {
    try {
        const response = await api.post('/auth/validate-otp', data);
        return response.data;
    } catch (error) {
        console.error("Error verifying OTP in:", error.message);
        throw error;
    }
};

export const approveUser = async (data: { token: string; userId: string }) => {
    try {
        const response = await api.get('/user/approve/' + data.userId, {
            headers: {
                'Authorization': `Bearer ${data.token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error verifying user in:", error.message);
        throw error;
    }
};