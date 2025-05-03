import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, FlatList, RefreshControl } from 'react-native';
import { ArrowLeft, Droplet, ChevronRight, Cpu, CpuIcon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useScript } from '../../../contexts/ScriptContext';
import deviceType from '../../../types/DeviceType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { apiUrl } from '../../../utils/ApiPath';
import { useEffect } from 'react';
import { useGetDevices } from '../../../hooks/useGetDevices';
import CircleSpinner from '../../../components/CircleSpinner';

const TriggerDeviceScreen = () => {
  const navigation = useNavigation();
  const { setTriggers } = useScript();
  const [selectedOption, setSelectedOption] = useState(null);
  const {  devices, 
    loading, 
    refreshing, 
    error, 
    refresh, 
    loadMore, 
    hasMore, 
    loadingMore 
} = useGetDevices();

  const weatherOptions = [
    {
      id: 1,
      title: 'Trạng thái thiết bị',
      deviceType: 'Khi trạng thái thiết bị thay đổi',
      icon: (props) => <Cpu {...props} />,
      color: '#2E7D32',
      to: 'Trạng thái thiết bị'
    }
  ];

  const handleOptionSelect = (option) => {

    navigation.navigate("Chọn trạng thái thiết bị", {device: option});
  };

  if(loading) {
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
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold">Trạng thái thiết bị</Text>
      </View>
      <Text className="text-base text-gray-600 px-4">
        Chọn trạng thái thiết bị để kích hoạt kịch bản của bạn
      </Text>
        
      <FlatList
          className="flex-1 p-4"
          data={devices}
          keyExtractor={(item) => item.id.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleOptionSelect(item)}
              className="flex-row items-center bg-white p-4 rounded-lg mb-3 border border-gray-100"
            >
              <View style={{ backgroundColor: '#2E7D3220', padding: 10, borderRadius: 12 }}>
                <CpuIcon size={24} color="#2E7D32" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-lg font-medium">{item.name}</Text>
                <Text className="text-sm text-gray-500 mt-1">{item.type}</Text>
              </View>
              <ChevronRight size={20} color="#CCCCCC" />
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
        />
    </SafeAreaView>
  );
};

export default TriggerDeviceScreen;
