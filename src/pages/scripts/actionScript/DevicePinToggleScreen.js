import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { ArrowLeft, Cpu } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useScript } from '../../../contexts/ScriptContext';
import { Power } from 'lucide-react-native';

const DevicePinToggleScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { setActions } = useScript();
  const { device } = route.params;
  const [pinStates, setPinStates] = useState({
    pin1: null,
    pin2: null,
    pin3: null
  });

  // Chọn trạng thái chân
  const handlePinSelect = (pinNumber, value) => {
    setPinStates(prev => ({
      ...prev,
      [`pin${pinNumber}`]: value
    }));
  };

  // Kiểm tra đã chọn trạng thái pin nào chưa
  const isPinStateSelected = Object.values(pinStates).some(state => state !== null);

  // Lưu action
  const handleSubmit = () => {
    if (!device) return;
    let params = [];
    console.log(device);
    if (pinStates.pin1 !== null) {
      params.push({ deviceId: device.id.id, pin: 1, value: pinStates.pin1, deviceName: device.name });
    }
    if (pinStates.pin2 !== null) {
      params.push({ deviceId: device.id.id, pin: 2, value: pinStates.pin2, deviceName: device.name });
    }
    if (pinStates.pin3 !== null) {
      params.push({ deviceId: device.id.id, pin: 3, value: pinStates.pin3, deviceName: device.name });
    }
    setActions(prev => {
      if (prev == null) prev = [];
      const index = prev.findIndex(action => action.CMD === 'SET_OUTPUT');
      if (index === -1) {
        prev.push({ CMD: 'SET_OUTPUT', params });
      } else {
        const deviceIndex = prev[index].params.findIndex(param => param.deviceId === device.id.id);
        if(deviceIndex === -1) {
          prev[index].params.push(...params);
        } else {
        prev[index].params.splice(deviceIndex, 1);
        prev[index].params.push(...params);
        }
      }
      return prev;
    });
    navigation.navigate('Điều kiện');
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full mr-4"
          accessibilityLabel="Back to device selection"
        >
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold">Chọn trạng thái</Text>
        <TouchableOpacity 
          onPress={handleSubmit}
          className="p-2 rounded-full ml-auto"
          accessibilityLabel="Save action"
          disabled={!isPinStateSelected}
        >
          <Text className={`text-lg font-semibold ${isPinStateSelected ? 'text-green-500' : 'text-gray-300'}`}>Tiếp theo</Text>
        </TouchableOpacity>
      </View>
      <View className="p-4 bg-white mb-4 rounded-lg mx-4 mt-4">
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center">
            <Cpu size={24} color="#3B82F6" />
          </View>
          <View className="ml-4">
            <Text className="text-lg font-medium">{device?.name}</Text>
            <Text className="text-sm text-gray-500">{device?.type}</Text>
          </View>
        </View>
      </View>
      <View className="p-4">
      {[1, 2, 3].map(pinNumber => (
          <View key={pinNumber} className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <Text className="text-lg font-medium mb-3">Pin {pinNumber}:</Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => handlePinSelect(pinNumber, true)}
                className={`flex-1 p-3 rounded-lg mr-2 items-center ${pinStates[`pin${pinNumber}`] === true ? 'bg-green-500' : 'bg-green-100'}`}
                accessibilityLabel={`Turn on Pin ${pinNumber}`}
              >
                <Power size={24} color={pinStates[`pin${pinNumber}`] === true ? "#FFFFFF" : "#34C759"} />
                <Text className={`mt-1 font-medium ${pinStates[`pin${pinNumber}`] === true ? 'text-white' : 'text-green-700'}`}>Bật</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => handlePinSelect(pinNumber, false)}
                className={`flex-1 p-3 rounded-lg mx-2 items-center ${pinStates[`pin${pinNumber}`] === false ? 'bg-red-500' : 'bg-red-100'}`}
                accessibilityLabel={`Turn off Pin ${pinNumber}`}
              >
                <Power size={24} color={pinStates[`pin${pinNumber}`] === false ? "#FFFFFF" : "#EF4444"} />
                <Text className={`mt-1 font-medium ${pinStates[`pin${pinNumber}`] === false ? 'text-white' : 'text-red-700'}`}>Tắt</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => handlePinSelect(pinNumber, null)}
                className={`flex-1 p-3 rounded-lg ml-2 items-center ${pinStates[`pin${pinNumber}`] === null ? 'bg-gray-300' : 'bg-gray-100'}`}
                accessibilityLabel={`No change for Pin ${pinNumber}`}
              >
                <Power size={24} color={pinStates[`pin${pinNumber}`] === null ? "#FFFFFF" : "#6B7280"} />
                <Text className={`mt-1 font-medium ${pinStates[`pin${pinNumber}`] === null ? 'text-white' : 'text-gray-700'}`}>Không đổi</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default DevicePinToggleScreen;
