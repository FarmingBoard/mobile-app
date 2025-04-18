import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl } from '../utils/ApiPath';

const updateDeviceDetail = async (deviceId, deviceName, deviceDescription) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = axios.post(`${apiUrl}/api/update-device`, {
            deviceId: deviceId,
            deviceName: deviceName,
            deviceDescription: deviceDescription
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `Bearer ${token}`,
            },
        });
        const data = response.data;
        console.log('Device details updated:', data);
    } catch (error) {
        console.error('Error updating device details:', error);
    }
}

export { updateDeviceDetail };