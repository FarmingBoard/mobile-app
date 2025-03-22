import axios from 'axios';
import {apiUrl} from '../utils/ApiPath';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useGetDevicesOfAsset =  async (assetId) => {

    const getDeviceCredentials = async (deviceId) => {
        try {
          const token = await AsyncStorage.getItem('token');
          const response = await axios.get(`${apiUrl}/api/device/info/${deviceId}`, {
            headers: {
              'Content-Type': 'application/json',
              'X-Authorization': `Bearer ${token}`,
            },
          });
      
          return response.data;
        } catch (error) {
          console.error('Error getting device credentials:', error);
          return null;
        }
      };

    

    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${apiUrl}/api/relations?fromId=${assetId}&fromType=ASSET`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': `Bearer ${token}`,
      },
    });

    const devices = await Promise.all(response.data.map(async (device) => {
        const rp = await getDeviceCredentials(device.id);
        return {
            id: rp.id.id,
            name: rp.name,
            active: rp.active
        }   
    }));

    return devices;
}