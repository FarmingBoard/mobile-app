import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { apiUrl } from '../utils/ApiPath';

// Tạo context
const AuthenticatedContext = createContext();

// Tạo provider
export const AuthenticatedProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const isTokenValid = async (token) => {
        try {
            const res = await fetch(apiUrl + '/api/auth/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                console.log('Thông tin người dùng:', data);
                return true; // Token hợp lệ
            }
            return false; // Token không hợp lệ
        } catch (error) {
            console.error('Lỗi khi giải mã token:', error);
            return false; // Token không hợp lệ
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                console.log('Token hợp lệ:', token);
                if (!await isTokenValid(token)) {
                    console.log('Token không hợp lệ hoặc đã hết hạn.');
                    Alert.alert('Thông báo', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
                    setIsAuthenticated(false);
                } else {
                    setIsAuthenticated(true);
                }
            } else {
                console.log('Token không hợp lệ hoặc đã hết hạn.');
                Alert.alert('Thông báo', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
                setIsAuthenticated(false);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    return (
        <AuthenticatedContext.Provider value={{ isAuthenticated, login, logout, loading }}>
            {children}
        </AuthenticatedContext.Provider>
    );
};

// Custom hook để sử dụng context
export const useAuthenticated = () => {
    return useContext(AuthenticatedContext);
};
