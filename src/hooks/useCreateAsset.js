import { useState } from 'react';
import axios from 'axios';
import { apiUrl as API_URL } from '../utils/ApiPath';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useCreateAsset = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createAsset = async (assetName) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/create-asset-z`, {
        "name": assetName
    }, {
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': `Bearer ${token}`
        }
      });

      console.log(response.data);
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo asset');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createAsset,
    loading,
    error
  };
};

export default useCreateAsset;
