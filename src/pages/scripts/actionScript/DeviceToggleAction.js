import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, FlatList, TextInput } from 'react-native';
import { ArrowLeft, Power, ChevronRight, Cpu } from 'lucide-react-native';
import { useScript } from '../../../contexts/ScriptContext';
import { useGetDevices } from '../../../hooks/useGetDevices';
import CircleSpinner from '../../../components/CircleSpinner';
import { useNavigation } from '@react-navigation/native';


const DeviceToggleAction = () => {
  const navigation = useNavigation();
  const { setActions } = useScript();
  const { devices, loading } = useGetDevices();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [pinStates, setPinStates] = useState({
    pin1: null,
    pin2: null,
    pin3: null
  });

  // Filter devices based on search query
  const filteredDevices = searchQuery.trim() === '' ? 
    devices : 
    devices.filter(device => 
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Handle device selection
  const handleDeviceSelect = (device) => {
    setSelectedDevice(device);
  };

  // Handle pin state selection with a more concise approach
  const handlePinSelect = (pinNumber, value) => {
    setPinStates(prev => ({
      ...prev,
      [`pin${pinNumber}`]: value
    }));
  };

  // Check if any pin state has been selected
  const isPinStateSelected = Object.values(pinStates).some(state => state !== null);

  // Handle save action
  const handleSubmit = () => {
    /*
    "actions": [
    {
      "CMD": "PUSH_NOTIFY",
      "params": [
        {
          "title": "Test"
        }
      ]
    },
    {
      "CMD": "SET_OUTPUT",
      "params": [
        {
          "deviceId": "f7725ee0-10b8-11f0-a6a5-31643b1c7793",
          "pin": 1,
          "value": 1
        },
        {
          "deviceId": "f7725ee0-10b8-11f0-a6a5-31643b1c7793",
          "pin": 2,
          "value": 1
        }
      ]
    }
  ]
    */
   if(!selectedDevice) {
    return;
   }
    let params = [];
    if (pinStates.pin1 !== null) {
      params.push({
        "deviceId": selectedDevice.id.id,
        "pin": 1,
        "value": pinStates.pin1
      });
    }
    if (pinStates.pin2 !== null) {
      params.push({
        "deviceId": selectedDevice.id.id,
        "pin": 2,
        "value": pinStates.pin2
      });
    }
    if (pinStates.pin3 !== null) {
      params.push({
        "deviceId": selectedDevice.id.id,
        "pin": 3,
        "value": pinStates.pin3
      });
    }
    
    setActions(prev => {
      if(prev == null) {
        prev = [];
      }
      const index = prev.findIndex(action => action.CMD === "SET_OUTPUT");
      if(index === -1) {
        prev.push({CMD: "SET_OUTPUT", params: params});
      } else {
        prev[index].params.push(...params);
      }
      return prev;
    });
    
    navigation.navigate('Điều kiện');
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <CircleSpinner />
      </View>
    );
  }

  // Device selection screen
  if (!selectedDevice) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
        <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
          <TouchableOpacity 
            onPress={() => navigation.navigate('ActionList')}
            className="p-2 rounded-full mr-4"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={24} color="#000000" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold">Chọn thiết bị</Text>
        </View>
        
        <View className="p-4">
          <View className="bg-white rounded-lg border border-gray-200 mb-4 flex-row items-center px-3">
            <TextInput
              className="flex-1 p-3"
              placeholder="Tìm kiếm thiết bị..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text className="text-gray-500 px-2">✕</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <FlatList
            data={filteredDevices}
            keyExtractor={(item) => item.id.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleDeviceSelect(item)}
                className="flex-row items-center p-4 bg-white rounded-lg mb-3 shadow-sm"
                accessibilityLabel={`Select device ${item.name}`}
              >
                <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center">
                  <Cpu size={22} color="#3B82F6" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-lg font-medium">{item.name}</Text>
                  <Text className="text-sm text-gray-500 mt-1">{item.type}</Text>
                </View>
                <ChevronRight size={20} color="#CCCCCC" />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center p-8 bg-white rounded-lg">
                <Text className="text-gray-500 text-center">Không tìm thấy thiết bị nào</Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </SafeAreaView>
    );
  } 
  // Pin state selection screen
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
        <TouchableOpacity 
          onPress={() => setSelectedDevice(null)}
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
        >
          <Text className='text-green-500 text-lg font-semibold'>Tiếp theo</Text>
        </TouchableOpacity>
      </View>
      
      <View className="p-4">
        <View className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center">
              <Cpu size={24} color="#3B82F6" />
            </View>
            <View className="ml-4">
              <Text className="text-lg font-medium">{selectedDevice?.name}</Text>
              <Text className="text-sm text-gray-500">{selectedDevice?.type}</Text>
            </View>
          </View>
        </View>
        
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
        
        {/* <TouchableOpacity
          onPress={handleSubmit}
          disabled={!isPinStateSelected}
          className={`w-full p-4 rounded-lg mt-6 ${isPinStateSelected ? 'bg-blue-500' : 'bg-blue-300'}`}
          accessibilityLabel="Save device settings"
        >
          <Text className="text-white text-center font-semibold text-lg">Lưu</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

export default DeviceToggleAction;