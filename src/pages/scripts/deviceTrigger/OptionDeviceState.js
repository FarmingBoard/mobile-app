import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, FlatList, RefreshControl } from 'react-native';
import { ArrowLeft, ChevronRight, Cpu, Droplet, Thermometer, Power, AirQuality, Rainbow, Sun, Cloud, IdCard, DoorOpenIcon } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useScript } from '../../../contexts/ScriptContext';
import CircleSpinner from '../../../components/CircleSpinner';

const OptionDeviceState = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { device } = route.params;
  const { addTrigger } = useScript();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    // Tạo các tùy chọn dựa trên loại thiết bị
    generateOptionsBasedOnDeviceType();
  }, [device]);

  const generateOptionsBasedOnDeviceType = () => {
    let deviceOptions = [];
    
    // Dựa vào loại thiết bị để tạo các tùy chọn khác nhau
    switch(device.type) {
      case 'Độ ẩm đất bơm nước':
        deviceOptions = [
          { id: 'isWatering', label:  'Trạng thái bơm', icon: Power, color: '#4CAF50', value: 'ON' },
          { id: 'soilMoisture', label: 'Độ ẩm đất', icon: Droplet, color: '#2196F3', value: 'ABOVE' },
          { id: 'pin_1', label: 'Output 1', icon: Power, color: '#4CAF50', value: 'ON' },
          { id: 'pin_2', label: 'Output 2', icon: Power, color: '#4CAF50', value: 'ON' },
          { id: 'pin_3', label: 'Output 3', icon: Power, color: '#4CAF50', value: 'ON' },
        ];
        break;
      
      case 'Không khí':
        deviceOptions = [
          { id: 'temp', label: 'Nhiệt độ', icon: Thermometer, color: '#FF9800', value: 'ABOVE' },
          { id: 'humidity', label: 'Độ ẩm', icon: Droplet, color: '#2196F3', value: 'ABOVE' },
          { id: 'pin_1', label: 'Output 1', icon: Power, color: '#4CAF50', value: 'ON' },
          { id: 'pin_2', label: 'Output 2', icon: Power, color: '#4CAF50', value: 'ON' },
          { id: 'pin_3', label: 'Output 3', icon: Power, color: '#4CAF50', value: 'ON' },
          
        ];
        break;

      case 'Ánh sáng, lượng mưa':
        deviceOptions = [
          { id: 'light', label: 'Ánh sáng', icon: Sun, color: '#FFC107', value: 'ABOVE' },
          { id: 'rain', label: 'Lượng mưa', icon: Cloud, color: '#607D8B', value: 'ABOVE' },
          { id: 'pin_1', label: 'Output 1', icon: Power, color: '#4CAF50', value: 'ON' },
          { id: 'pin_2', label: 'Output 2', icon: Power, color: '#4CAF50', value: 'ON' },
          { id: 'pin_3', label: 'Output 3', icon: Power, color: '#4CAF50', value: 'ON' },
        ];
        break;

      case 'Cửa thẻ từ':
        deviceOptions = [
          { id: 'isOpen', label: 'Trạng thái cửa', icon: DoorOpenIcon, color: '#4CAF50', value: 'ON' },
          { id: 'RFID', label: 'Thẻ từ', icon: IdCard, color: '#4CAF50', value: 'ON' },
          { id: 'pin_1', label: 'Output 1', icon: Power, color: '#4CAF50', value: 'ON' },
          { id: 'pin_2', label: 'Output 2', icon: Power, color: '#4CAF50', value: 'ON' },
          { id: 'pin_3', label: 'Output 3', icon: Power, color: '#4CAF50', value: 'ON' },
        ];
        break;
        
      default:
        // Tùy chọn mặc định cho các thiết bị khác
        deviceOptions = [
          { id: 'device_on', label: 'Bật thiết bị', icon: Power, color: '#4CAF50', value: 'ON' },
          { id: 'device_off', label: 'Tắt thiết bị', icon: Power, color: '#F44336', value: 'OFF' }
        ];
    }
    
    setOptions(deviceOptions);
  };

  const handleOptionSelect = (option) => {
    // Kiểm tra xem tham số này cần chọn giá trị cụ thể hay không
    const needsValueSelection = [
      'temp', 'humidity', 'soilMoisture', 'light', 'rain'
    ].includes(option.id);
    
    if (needsValueSelection) {
      // Chuyển đến trang chọn giá trị thông số
      navigation.navigate('DeviceParameterScreen', {
        device: device,
        parameter: option
      });
    } else {
      // Thêm trigger vào ScriptContext cho các tham số boolean
      const trigger = {
        type: 'device',
        device: device,
        parameter: option.id,
        value: option.value,
        label: `${device.name} - ${option.label}`
      };
      
      addTrigger(trigger);
      
      // Quay lại trang tạo kịch bản
      navigation.navigate('CreateAddjustScript');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <CircleSpinner />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full mr-4"
        >
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold">Chọn trạng thái thiết bị</Text>
      </View>
      
      <View className="p-4 bg-white mb-4 rounded-lg mx-4 mt-4">
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center">
            <Cpu size={24} color="#3B82F6" />
          </View>
          <View className="ml-4">
            <Text className="text-lg font-medium">{device.name}</Text>
            <Text className="text-sm text-gray-500">{device.type}</Text>
          </View>
        </View>
      </View>

      <Text className="text-base text-gray-600 px-4 mb-2">
        Chọn trạng thái thiết bị để kích hoạt kịch bản
      </Text>
      
      <FlatList
        className="flex-1 px-4"
        data={options}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleOptionSelect(item)}
            className="flex-row items-center p-4 bg-white rounded-lg mb-3 shadow-sm"
          >
            <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: `${item.color}20` }}>
              <item.icon size={20} color={item.color} />
            </View>
            <Text className="text-lg font-medium ml-4">{item.label}</Text>
            <View className="flex-1" />
            <ChevronRight size={20} color="#CCCCCC" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-8">
            <Text className="text-gray-500 text-center">Không có tùy chọn cho thiết bị này</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default OptionDeviceState;