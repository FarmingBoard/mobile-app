import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { ArrowLeft, CpuIcon, Download, DownloadCloud, HardDriveDownload, Info } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import CircleSpinner from '../components/CircleSpinner';
import deviceType from '../types/DeviceType';
import { updateDeviceDetail } from '../api/updateDevice';
import { getDeviceSettings, setDeviceSettings } from '../api/deviceSettingsApi';
import { set } from 'date-fns';

const DeviceSettings = ({ route }) => {
  const { device } = route.params;
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [deviceChanges, setDeviceChanges] = useState({});
  const [isOpenModalInfo, setIsOpenModalInfo] = useState(false);

  useEffect(() => {
    async function fetchDeviceSettings() {
      setLoading(true);
      const fetchSettings = await getDeviceSettings(device.id);
      if (fetchSettings) {
        setDeviceChanges((prevState) => ({
          ...prevState,
          ...fetchSettings,
        }));
      }
      setLoading(false);
    }
    fetchDeviceSettings();
  }, [device]);

  const handleChangeKey = (key, value) => {
    setDeviceChanges({
      ...deviceChanges,
      [key]: value
    });
  };

  const validateInputs = () => {
    // Check if name is provided
    if (!deviceChanges.name.trim()) {
      Alert.alert("Validation Error", "Device name is required");
      return false;
    }

    // Validate numeric fields
    const airNumericFields = [
      { key: 'minCircleNotification', label: 'Minimum alert distance' },
      { key: 'minTemperature', label: 'Temperature lower limit' },
      { key: 'maxTemperature', label: 'Temperature upper limit' },
      { key: 'minHumidity', label: 'Humidity lower limit' },
      { key: 'maxHumidity', label: 'Humidity upper limit' },
      { key: 'minAirQuality', label: 'Air quality lower limit' },
      { key: 'maxAirQuality', label: 'Air quality upper limit' },
    ];

    const lightRainNumericFields = [
      { key: 'minCircleNotification', label: 'Minimum alert distance' },
      { key: 'minLight', label: 'Light intensity lower limit' },
      { key: 'maxLight', label: 'Light intensity upper limit' },
      { key: 'minRain', label: 'Rainfall lower limit' },
      { key: 'maxRain', label: 'Rainfall upper limit' },
    ]

    if(device.device_type == "AIR") {
      for (const field of airNumericFields) {
        const value = parseFloat(deviceChanges[field.key]);
        if (isNaN(value)) {
          Alert.alert("Validation Error", `${field.label} must be a valid number`);
          return false;
        }
      }
    }

    if(device.device_type == "LIGHT_RAIN") {
      for (const field of lightRainNumericFields) {
        const value = parseFloat(deviceChanges[field.key]);
        if (isNaN(value)) {
          Alert.alert("Validation Error", `${field.label} must be a valid number`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    const newDeviceSettings = await setDeviceSettings(device.id, deviceChanges);
    if (newDeviceSettings) {
      setLoading(false);
        Alert.alert("Success", "Device settings updated successfully");
        navigation.goBack();
    } else {
      setLoading(false);
      Alert.alert("Error", "Failed to update device settings");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-50">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View className="flex-1 justify-center items-center">
          <CircleSpinner size={50} color="#10b981" />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-slate-50 text-black">
        <ScrollView className="flex-1 p-4">
          {/* <DeivceDetailSetting device={device}/> */}
          <View className="bg-white text-black rounded-lg p-4 mb-4 shadow-sm">
              <Text className="text-lg mb-4 font-bold text-black">Thông tin thiết bị</Text>
                {/* Button cap nhật thiết bị */}
              <Text className="text-sm text-gray-600 mb-1">Tên thiết bị</Text>
              <TextInput
                    placeholder="Tên thiết bị"
                    className="border border-gray-300 rounded-lg p-3 mb-4 text-black" 
                    value={deviceChanges.deviceName}
                    onhangeText={(text) => handleChangeKey("deviceName", text)}
              />
              <Text className="text-sm text-gray-600 mb-1">Mô tả</Text>
              <TextInput
                    placeholder="Mô tả"
                    className="border border-gray-300 rounded-lg p-3 mb-2 text-black"
                    value={deviceChanges.deviceDescription}
                    onChangeText={(text) => handleChangeKey("deviceDescription", text)}       
                    multiline
                    numberOfLines={3}
              />
              {/* Phan cung update */}
              <View className='flex-row items-center mt-4'>
                <Text className="text-sm text-gray-600">Phiên bản firmware: firmware_v0.0.1</Text>
                <TouchableOpacity
                  className="px-3 py-2 rounded-lg flex-row items-center gap-2"
                  onPress={() => setIsOpenModalInfo(true)}
                >
                  <HardDriveDownload size={20} color="green" /> 
                  <Text className="text-sm text-green-500">Cập nhật</Text>
                </TouchableOpacity>
              </View>
          </View>

          <View className="bg-white text-black rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-lg font-bold mb-4 text-black">Dữ liệu gửi lên</Text>
            <Text className="text-sm text-gray-600 mb-1">Thời gian giữa 2 lần gửi dữ liệu (&gt; 1 giây)</Text>
            <TextInput
              placeholder="Ví dụ 60s thì gõ 60"
              className="border border-gray-300 rounded-lg p-3 mb-4 text-black"
              value={deviceChanges.timeSend}
              onChangeText={(text) => handleChangeKey("timeSend", text)}
            />
          </View>
          
          
          { device.device_type == "AIR" && (<View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-lg font-bold mb-4 text-black">Cài đặt thông báo</Text>
            <Text className="text-sm text-gray-600 mb-1">Khoảng thời gian tối thiểu giữa 2 thông báo (&gt;10p)</Text>
            <TextInput
              placeholder="Enter minimum distance for alerts"
              className="border border-gray-300 rounded-lg p-3 mb-4 text-black"
              value={deviceChanges.minCircleNotification}
              onChangeText={(text) => handleChangeKey("minCircleNotification", text)}
              keyboardType="numeric"
            />
            
            <Text className="text-lg font-semibold mb-2 text-black">Nhiệt độ giới hạn</Text>
            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-sm text-gray-600 mb-1">Giới hạn dưới (°C)</Text>
                <TextInput
                  placeholder="Min"
                  className="border border-gray-300 rounded-lg p-3 text-black"
                  value={deviceChanges.minTemperature}
                  onChangeText={(text) => handleChangeKey("minTemperature", text)}
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-sm text-gray-600 mb-1">Giới hạn trên (°C)</Text>
                <TextInput
                  placeholder="Max"
                  className="border border-gray-300 rounded-lg p-3"
                  value={deviceChanges.maxTemperature}
                  onChangeText={(text) => handleChangeKey("maxTemperature", text)}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <Text className="text-lg font-semibold mb-2 text-black">Độ ẩm giới hạn</Text>
            <View className="flex-row mb-2">
              <View className="flex-1 mr-2">
                <Text className="text-sm text-gray-600 mb-1">Giới hạn dưới (%)</Text>
                <TextInput
                  placeholder="Min"
                  className="border border-gray-300 rounded-lg p-3 text-black"
                  value={deviceChanges.minHumidity}
                  onChangeText={(text) => handleChangeKey("minHumidity", text)}
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-sm text-gray-600 mb-1">Giới hạn trên (%)</Text>
                <TextInput
                  placeholder="Max"
                  className="border border-gray-300 rounded-lg p-3 text-black"
                  value={deviceChanges.maxHumidity}
                  onChangeText={(text) => handleChangeKey("maxHumidity", text)}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View className="flex-row mb-2">
              <View className="flex-1 mr-2">
                <Text className="text-sm text-gray-600 mb-1">Chất lượng không khí giới hạn</Text>
                <TextInput
                  placeholder="Min"
                  className="border border-gray-300 rounded-lg p-3 text-black"
                  value={deviceChanges.minAirQuality}
                  onChangeText={(text) => handleChangeKey("minAirQuality", text)}
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-sm text-gray-600 mb-1">Giới hạn trên</Text>
                <TextInput
                  placeholder="Max"
                  className="border border-gray-300 rounded-lg p-3 text-black"
                  value={deviceChanges.maxAirQuality}
                  onChangeText={(text) => handleChangeKey("maxAirQuality", text)}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>)}

          { device.device_type == "LIGHT_RAIN" && (<View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-lg font-bold mb-4 text-black">Cài đặt thông báo</Text>
            <Text className="text-sm text-gray-600 mb-1">Khoảng thời gian tối thiểu giữa 2 thông báo (&gt;10p)</Text>
            <TextInput
              placeholder="Enter minimum distance for alerts"
              className="border border-gray-300 rounded-lg p-3 mb-4 text-black"
              value={deviceChanges.minCircleNotification}
              onChangeText={(text) => handleChangeKey("minCircleNotification", text)}
              keyboardType="numeric"
            />
            
            <Text className="text-lg font-semibold mb-2 text-black">Cường độ ánh sáng</Text>
            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-sm text-gray-600 mb-1">Giới hạn dưới (/100)</Text>
                <TextInput
                  placeholder="Min"
                  className="border border-gray-300 rounded-lg p-3 text-black"
                  value={deviceChanges.minLight}
                  onChangeText={(text) => handleChangeKey("minLight", text)}
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-sm text-gray-600 mb-1">Giới hạn trên (/100)</Text>
                <TextInput
                  placeholder="Max"
                  className="border border-gray-300 rounded-lg p-3"
                  value={deviceChanges.maxLight}
                  onChangeText={(text) => handleChangeKey("maxLight", text)}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <Text className="text-lg font-semibold mb-2 text-black">Cường độ mưa</Text>
            <View className="flex-row mb-2">
              <View className="flex-1 mr-2">
                <Text className="text-sm text-gray-600 mb-1">Giới hạn dưới (/100)</Text>
                <TextInput
                  placeholder="Min"
                  className="border border-gray-300 rounded-lg p-3 text-black"
                  value={deviceChanges.minHumidity}
                  onChangeText={(text) => handleChangeKey("minHumidity", text)}
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-sm text-gray-600 mb-1">Giới hạn trên (/100)</Text>
                <TextInput
                  placeholder="Max"
                  className="border border-gray-300 rounded-lg p-3 text-black"
                  value={deviceChanges.maxHumidity}
                  onChangeText={(text) => handleChangeKey("maxHumidity", text)}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>)}
          
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-lg font-bold mb-4 text-black">Cài đặt wifi</Text>
            <Text className="text-sm text-gray-600 mb-1">Tên Wifi (SSID)</Text>
            <TextInput
              placeholder="Enter WiFi name"
              className="border border-gray-300 rounded-lg p-3 mb-4 text-black"
              value={deviceChanges.wifiSsid}
              onChangeText={(text) => handleChangeKey("wifiSsid", text)}
            />
            
            <Text className="text-sm text-gray-600 mb-1 ">Mật khẩu</Text>
            <TextInput
              placeholder="Enter WiFi password"
              className="border border-gray-300 rounded-lg p-3 mb-2 text-black"
              value={deviceChanges.wifiPass}
              onChangeText={(text) => handleChangeKey("wifiPass", text)}
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity
            className="bg-green-500 p-4 rounded-lg mb-6"
            onPress={handleSaveChanges}
          >
            <Text className="text-white text-center font-bold text-lg">Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>

        {isProcessing && (
          <View className="absolute inset-0 bg-black/30 items-center justify-center z-50">
            <View className="bg-white p-6 rounded-2xl">
              <CircleSpinner size={40} color="#10b981" />
              <Text className="mt-2 text-gray-700">Updating device...</Text>
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const DeivceDetailSetting = (device) => {
  const [deviceName, setDeviceName] = useState("");
  const [description, setDescription] = useState("");

  
  useEffect(() => {
    setDeviceName(device.device.name);
  }, [device]);

  const handleUpdate = () => {
    try {
      updateDeviceDetail(device.device.id, deviceName, description);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View className="bg-white text-black rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-lg font-bold mb-4 text-black">Thông tin thiết bị</Text>
            <Text className="text-sm text-gray-600 mb-1">Tên thiết bị</Text>
            <TextInput
              placeholder="Tên thiết bị"
              className="border border-gray-300 rounded-lg p-3 mb-4 text-black" 
              value={deviceName}
              onChangeText={(text) => setDeviceName(text)}
            />

            <Text className="text-sm text-gray-600 mb-1">Mô tả</Text>
            <TextInput
              placeholder="Mô tả"
              className="border border-gray-300 rounded-lg p-3 mb-2 text-black"
              value={description}
              onChangeText={(text) => setDescription(text)}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity
              className="bg-green-700 ml-auto px-3 py-2 rounded-lg mt-2"
              onPress={handleUpdate}
            >
              <Text className="text-white text-center font-bold text-lg">Cập nhật</Text>
          </TouchableOpacity>
    </View>
  )
}

export default DeviceSettings;