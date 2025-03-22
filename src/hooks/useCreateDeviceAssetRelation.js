import { useCallback } from 'react';
import axios from 'axios';
import { apiUrl } from '../utils/ApiPath';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useCreateDeviceAssetRelation = () => {
  const createDeviceAssetRelation = useCallback(async (deviceId, assetId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/api/relation`, {
        "from": {
          "entityType": "ASSET",
          "id": assetId
        },
        "to": {
          "entityType": "DEVICE",
          "id": deviceId
        },
        "type": "Contains"
      }, {
        headers: {
          'Content-Type': 'application/json',
        'X-Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating device-asset relation:', error);
      throw error;
    }
  }, []);

  return { createDeviceAssetRelation };
};

export default useCreateDeviceAssetRelation;
