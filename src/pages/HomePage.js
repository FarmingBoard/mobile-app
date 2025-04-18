// HomePage.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { Cpu, ChevronLeft, ChevronRight, Plus, Cloud, Sun, CloudRain, CloudSnow, MapPin } from "lucide-react-native";
import useGetAssets from "../hooks/useGetAssets";
import { useGetDeviceOfAssets } from "../hooks/useGetDeviceOfAssets";
import CircleSpin from '../components/CircleSpinner';
import DeviceItem from "../components/DeviceItem";
import { useNavigation } from "@react-navigation/native";
import { getDevicesOfAsset } from "../api/getDeviceOfAssets";

const imageGarden = '../../assets/garden.jpg';

const HomePage = () => {
  const { assets: spaces, loading } = useGetAssets();
  const [selectedSpaceIndex, setSelectedSpaceIndex] = useState(0);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const navigation = useNavigation();

  // Weather state (would be fetched from API in real implementation)
  const [weather, setWeather] = useState({
    temperature: 28,
    condition: 'sunny',
    location: 'Hà Nội',
    humidity: 65,
  });

  useEffect(() => {
    if (spaces.length > 0) {
      setSelectedSpace(spaces[0]);
    }
  }, [spaces]);

  const navigateToPreviousSpace = () => {
    if (selectedSpaceIndex === 0) return;
    setSelectedSpaceIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      setSelectedSpace(spaces[newIndex]);
      return newIndex;
    });
  };

  const navigateToNextSpace = () => {
    if (selectedSpaceIndex === spaces.length - 1) return;
    setSelectedSpaceIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      setSelectedSpace(spaces[newIndex]);
      return newIndex;
    });
  };

  // Select weather icon based on condition
  const getWeatherIcon = () => {
    switch(weather.condition) {
      case 'sunny':
        return <Sun size={20} color="#f59e0b" />;
      case 'cloudy':
        return <Cloud size={20} color="#64748b" />;
      case 'rainy':
        return <CloudRain size={20} color="#3b82f6" />;
      case 'snowy':
        return <CloudSnow size={20} color="#94a3b8" />;
      default:
        return <Sun size={20} color="#f59e0b" />;
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <CircleSpin />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      {/* Combined Header with Logo and Weather */}
      <View className="bg-white pt-4 pb-3 shadow-sm">
        <View className="px-5 flex-row items-center justify-between">
          {/* Logo and App Title */}
          <View className="flex-row items-center">
            <Image 
              source={require('../../assets/logo.jpg')} // Replace with your actual logo path
              className="w-9 h-9"
              defaultSource={require('../../assets/logo.jpg')} // Fallback image
            />
            <Text className="ml-2 text-lg font-bold text-emerald-700">SmartFarming</Text>
          </View>
          
          {/* Weather Information */}
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-amber-50 rounded-full items-center justify-center mr-2">
              {getWeatherIcon()}
            </View>
            <View>
              <View className="flex-row items-center">
                <Text className="text-lg font-bold text-gray-800">{weather.temperature}°</Text>
                <MapPin size={12} color="#64748b" className="ml-1" />
                <Text className="text-xs text-gray-500">{weather.location}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      
      {/* Redesigned Garden Space Switcher */}
      <View className="mx-5 my-4">
        <View className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          {/* Garden Image Banner */}
          <View className="h-32 bg-emerald-100 overflow-hidden">
            <Image 
              source={require(imageGarden)}
              className="w-full h-full"
              style={{ opacity: 0.8 }}
            />
            {/* Overlay with garden name */}
            <View className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
              <Text className="text-white text-xl font-bold">
                {selectedSpace?.name || "Khu vườn của tôi"}
              </Text>
            </View>
          </View>
          
          {/* Navigation Controls */}
          <View className="flex-row items-center justify-between p-3 bg-white">
            <View className="flex-row">
              <TouchableOpacity
                className={`w-8 h-8 rounded-full items-center justify-center mr-2 ${
                  selectedSpaceIndex === 0 ? 'bg-gray-100' : 'bg-emerald-100'
                }`}
                onPress={navigateToPreviousSpace}
                disabled={selectedSpaceIndex === 0}
              >
                <ChevronLeft size={18} color={selectedSpaceIndex === 0 ? "#9ca3af" : "#10b981"} />
              </TouchableOpacity>
              
              <TouchableOpacity
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  selectedSpaceIndex === spaces.length - 1 ? 'bg-gray-100' : 'bg-emerald-100'
                }`}
                onPress={navigateToNextSpace}
                disabled={selectedSpaceIndex === spaces.length - 1}
              >
                <ChevronRight size={18} color={selectedSpaceIndex === spaces.length - 1 ? "#9ca3af" : "#10b981"} />
              </TouchableOpacity>
            </View>
            
            {/* Garden Indicator */}
            <View className="flex-row items-center">
              {spaces.map((_, index) => (
                <View 
                  key={index}
                  className={`w-2 h-2 rounded-full mx-0.5 ${
                    index === selectedSpaceIndex ? 'bg-emerald-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </View>
            
            {/* Add Garden Button */}
            <TouchableOpacity
              className="w-8 h-8 bg-emerald-500 rounded-full items-center justify-center shadow-sm"
              onPress={() => navigation.navigate('AddAsset')}
            >
              <Plus size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Devices section header */}
      <View className="px-5 py-2 flex-row justify-between items-center">
        <Text className="text-lg font-bold text-gray-800">
          Thiết bị trong khu vườn
        </Text>
        <TouchableOpacity
          className="bg-emerald-50 px-3 py-1.5 rounded-full"
          onPress={() => navigation.navigate('AddDevice')}
        >
          <Text className="text-sm font-medium text-emerald-600">Thêm thiết bị</Text>
        </TouchableOpacity>
      </View>

      {/* Devices list */}
      <DevicesOfSpace space={selectedSpace} />
    </View>
  );
};

const DevicesOfSpace = ({ space }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  
  useEffect(() => {
    async function fetchDevices() {
      if(!space) return;
      setLoading(true);
      try {     
        const devices = await getDevicesOfAsset(space?.id?.id);
        setDevices(devices);
      } catch (error) {
        console.error("Error fetching devices:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDevices();
  }, [space, refresh]);


  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white/80">
        <CircleSpin />
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 px-5"
      data={devices || []}
      renderItem={({ item }) => <DeviceItem device={item} />}
      keyExtractor={(item) => item.id}
      onRefresh={() => {
        setRefresh(prev => !prev);
      }}
      refreshing={loading}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View className="flex-1 justify-center items-center py-10">
          <Cpu size={40} color="#d1d5db" />
          <Text className="text-gray-400 mt-4 text-center">
            Không có thiết bị nào trong không gian này
          </Text>
        </View>
      }
    />
  );
};

export default HomePage;