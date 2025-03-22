import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { apiUrl } from '../utils/ApiPath';

const useGetAccessToken = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAccessToken = async (deviceId) => {
        setLoading(true);
        setError(null);

        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${apiUrl}/api/device/${deviceId}/credentials`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': `Bearer ${token}`,
                },
            });

            return response.data.credentialsId;

        } catch (err) {
            console.error('Error getting access token:', err);
            setError(err.response?.data?.message || err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        getAccessToken,
        loading,
        error
    };
};

export default useGetAccessToken;