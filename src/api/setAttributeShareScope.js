/*
const response = await fetch(`${apiUrl}/api/plugins/telemetry/${deviceId}/SHARED_SCOPE`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          lightState: !isOn
        }),
      });
*/
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl } from '../utils/ApiPath';

export const setAttributeShareScope = async (deviceId, attribute, value) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/api/plugins/telemetry/${deviceId}/SHARED_SCOPE`, {
        [attribute]: value
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error setting attribute share scope:', error);
      return null;
    }
  };
