import { useState, useEffect } from 'react';
import { Platform, Alert, PermissionsAndroid } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const useBleManager = () => {
  const [bleManager, setBleManager] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const manager = new BleManager();
    setBleManager(manager);

    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        const granted = await requestAndroidPermissions();
        if (!granted) {
          Alert.alert('Quyền truy cập', 'Cần quyền truy cập Bluetooth để quét thiết bị');
        }
      }
    };

    requestPermissions();

    return () => {
      if (isScanning) {
        manager.stopDeviceScan();
      }
      manager.destroy();
    };
  }, []);

  const requestAndroidPermissions = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ...(Platform.Version >= 31 
            ? [
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
              ] 
            : [])
        ]);
        
        return (
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED &&
          (Platform.Version < 31 || 
            (granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
             granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED))
        );
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const startScan = () => {
    if (!bleManager) {
      Alert.alert('Lỗi', 'Bluetooth chưa sẵn sàng, vui lòng thử lại');
      return;
    }

    setDevices([]);
    setIsScanning(true);

    const discoveredDevices = new Map();

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Lỗi quét thiết bị:', error);
        stopScan();
        Alert.alert('Lỗi', 'Không thể quét thiết bị Bluetooth. Vui lòng thử lại.');
        return;
      }

      if (device && device.name && !discoveredDevices.has(device.id)) {
        discoveredDevices.set(device.id, device);
        setDevices(Array.from(discoveredDevices.values()));
      }
    });

    setTimeout(() => {
      stopScan();
    }, 10000);
  };

  const stopScan = () => {
    if (bleManager) {
      bleManager.stopDeviceScan();
      setIsScanning(false);
    }
  };

  return {
    bleManager,
    isScanning,
    devices,
    startScan,
    stopScan,
  };
};

export default useBleManager;
