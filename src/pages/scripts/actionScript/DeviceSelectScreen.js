import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, FlatList, TextInput } from 'react-native';
import { ArrowLeft, Cpu, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useGetDevices } from '../../../hooks/useGetDevices';
import CircleSpinner from '../../../components/CircleSpinner';

const DeviceSelectScreen = () => {
  const navigation = useNavigation();
  const { devices, loading } = useGetDevices();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter devices based on search query
  const filteredDevices = searchQuery.trim() === '' ? 
    devices : 
    devices.filter(device => 
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (loading) {
    return <CircleSpinner />;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 rounded-full mr-4">
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold">Chọn thiết bị</Text>
      </View>
      <View className="p-4">
        <TextInput
          className="bg-gray-100 p-3 rounded-lg mb-4"
          placeholder="Tìm kiếm thiết bị..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FlatList
          data={filteredDevices}
          keyExtractor={item => item.id.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="flex-row items-center p-4 bg-white rounded-lg mb-2 shadow-sm"
              onPress={() => navigation.navigate('DevicePinToggleScreen', { device: item })}
            >
              <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
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
              <Text className="text-gray-500 text-center">Không tìm thấy thiết bị</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default DeviceSelectScreen;
