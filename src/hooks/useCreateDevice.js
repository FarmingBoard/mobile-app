import { useState } from 'react';
import axios from 'axios';
import { apiUrl as API_URL } from '../utils/ApiPath';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useCreateDevice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createDevice = async (deviceName, macAddress, device_type) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/create-device-z`, {
        "name": deviceName,   
        "type": "",
        "label": "",
        "deviceData": {
          "configuration": {
            "type": "DEFAULT"
          },
          "transportConfiguration": {
            "type": "DEFAULT",
            "powerMode": "PSM",
            "psmActivityTimer": 86400,  // 1 ngày
            "edrxCycle": 2000,  // 2 giây
            "pagingTransmissionWindow": 500  // 500 mili-giây
          }
        },
        "attributes": {
    "inactivityTimeout": 300
  },
        "additionalInfo": { 
          "macAddress": macAddress,
          "device_type": device_type
        }
    }, {
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': `Bearer ${token}`
        }
      });

      console.log(response.data);
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo thiết bị');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createDevice,
    loading,
    error
  };
};

export default useCreateDevice;
