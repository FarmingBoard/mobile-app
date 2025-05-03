// utils/getLocation.js cho React Native
import Geolocation from 'react-native-geolocation-service';  // Hoặc từ thư viện tương tự
import { Platform, PermissionsAndroid } from 'react-native';

// Hàm xin quyền truy cập vị trí trên Android
const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    return true;  // iOS xử lý quyền khác
  }
  
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Quyền truy cập vị trí",
        message: "Ứng dụng cần quyền truy cập vị trí của bạn",
        buttonNeutral: "Hỏi lại sau",
        buttonNegative: "Từ chối",
        buttonPositive: "Đồng ý"
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

export const getCurrentLocation = async () => {
  // Kiểm tra và xin quyền
  const hasPermission = await requestLocationPermission();
  
  if (!hasPermission) {
    throw new Error('Không có quyền truy cập vị trí');
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 1000 
      }
    );
  });
};