import { useState } from 'react';
import { Alert } from 'react-native';
import { SERVICE_UUID } from '../utils/deviceConstants';

const useDeviceConnection = (bleManager) => {
  const [currentDevice, setCurrentDevice] = useState(null);

  const connectToDevice = async (device) => {
    if (!bleManager) {
      Alert.alert('Lỗi', 'Bluetooth chưa sẵn sàng, vui lòng thử lại');
      return false;
    }

    try {
      console.log('Đang kết nối với thiết bị:', device.name);
      
      const connectedDevice = await device.connect();
      console.log('Đã kết nối với thiết bị');

      const discoveredDevice = await connectedDevice.discoverAllServicesAndCharacteristics();
      console.log('Đã khám phá services và characteristics');

      const services = await discoveredDevice.services();
      let hasRequiredService = false;
      
      for (const service of services) {
        if (service.uuid === SERVICE_UUID) {
          hasRequiredService = true;
          console.log('Tìm thấy service phù hợp');
          break;
        }
      }

      if (!hasRequiredService) {
        Alert.alert('Lỗi', 'Thiết bị không hỗ trợ service cần thiết');
        await device.cancelConnection();
        return false;
      }

      setCurrentDevice(device);
      Alert.alert('Thành công', 'Đã kết nối với thiết bị ' + device.name);
      return true;

    } catch (error) {
      console.error('Lỗi kết nối:', error);
      Alert.alert('Lỗi', 'Không thể kết nối với thiết bị. Vui lòng thử lại.');
      return false;
    }
  };

  const disconnectDevice = async () => {
    if (currentDevice) {
      try {
        await currentDevice.cancelConnection();
        setCurrentDevice(null);
        return true;
      } catch (error) {
        console.error('Lỗi ngắt kết nối:', error);
        return false;
      }
    }
    return true;
  };

  return {
    currentDevice,
    connectToDevice,
    disconnectDevice,
  };
};

export default useDeviceConnection;
