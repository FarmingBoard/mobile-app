import axios from 'axios';
import {apiUrl} from '../utils/ApiPath';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getDevicesOfAsset =  async (assetId) => {

    const getDeviceCredentials = async (deviceId) => {
      if(deviceId === null || deviceId === undefined) return [];
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
        const rp = await getDeviceCredentials(device.to.id);
        return {
            id: rp.id.id,
            name: rp.name,
            active: rp.active,
            deviceProfileName: rp.deviceProfileName,
            deviceProfileId: rp.deviceProfileId
        }   
    }));

    return devices;
}