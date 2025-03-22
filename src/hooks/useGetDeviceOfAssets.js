import {useState, useEffect} from 'react';
import axios from 'axios';
import {apiUrl} from '../utils/ApiPath';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useGetDeviceOfAssets = (assetId) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);


  const getDeviceCredentials = async (deviceId) => {
    if(!deviceId) return [];
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
  
  useEffect(() => {
    const fetchDevices = async () => {
      if (!assetId) return;
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${apiUrl}/api/relations?fromId=${assetId}&fromType=ASSET`, {
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': `Bearer ${token}`,
          },
        });

        console.log( response.data);

        const devices = await Promise.all(response.data.map(async (device) => {
            const rp = await getDeviceCredentials(device.to.id); 
            return {
                id: rp.id.id,
                name: rp.name,
                active: rp.active,
                device_type: rp.additionalInfo.device_type
            }   
        }));
        console.log(devices);

        setDevices(devices);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [assetId, refresh]);

  return { devices, loading, setRefresh };
};
