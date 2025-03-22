// SoilMoistureAdjust.js
import React, { useState, useEffect } from 'react';
import { View, Text, Switch } from 'react-native';
import { Droplet, Sprout } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

const SoilMoistureAdjust = ({ 
  soilMoisture,
  isWatering,
  moistureThreshold,
  setMoistureThreshold,
  setSoilMoisture,
  setIsWatering,
  timePump,
  setTimePump,
 }) => {

  return (
    <View className="bg-white rounded-xl shadow-sm p-4">
      {/* Current Moisture */}
      <View className="flex-row items-center justify-between mb-4 bg-blue-50 p-3 rounded-lg">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2">
            <Droplet size={16} color="#3b82f6" />
          </View>
          <Text className="text-blue-700 font-medium">Độ ẩm hiện tại</Text>
        </View>
        <Text className="text-xl font-bold text-blue-800">{soilMoisture}</Text>
      </View>
      
      {/* Watering Status */}
      <View className="flex-row items-center justify-between mb-4 bg-emerald-50 p-3 rounded-lg">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-emerald-100 items-center justify-center mr-2">
            <Sprout size={16} color="#10b981" />
          </View>
          <Text className="text-emerald-700 font-medium">Trạng thái tưới</Text>
        </View>
        <Switch
          value={isWatering}
          onValueChange={(value) => setIsWatering('isWatering', value)}
          trackColor={{ false: "#d1d5db", true: "#10b981" }}
          thumbColor="#ffffff"
          ios_backgroundColor="#d1d5db"
        />
      </View>

      {/* Pump time */}
      <View className="mb-4">
        <Text className="text-gray-700 font-medium mb-2">Thời gian tưới tính từ lúc kích hoạt:</Text>
        <Slider
          style={{width: '100%', height: 40}}
          minimumValue={0}
          maximumValue={60}
          step={1}
          value={timePump}
          onValueChange={(value) => setTimePump('timePump', value)}
          minimumTrackTintColor="#10b981"
          maximumTrackTintColor="#d1d5db"
          thumbTintColor="#059669"
        />
        <View className="flex-row justify-between">
          <Text className="text-gray-500">0 phút</Text>
          <Text className="text-emerald-600 font-bold">{timePump} phút</Text>
          <Text className="text-gray-500">60 phút</Text>
        </View>
      </View>
      
      {/* Moisture Threshold */}
      <View className="mb-4">
        <Text className="text-gray-700 font-medium mb-2">Ngưỡng độ ẩm để tưới:</Text>
        <Slider
          style={{width: '100%', height: 40}}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={moistureThreshold}
          onValueChange={(value) => setMoistureThreshold('moistureThreshold', value)}
          minimumTrackTintColor="#10b981"
          maximumTrackTintColor="#d1d5db"
          thumbTintColor="#059669"
        />
        <View className="flex-row justify-between">
          <Text className="text-gray-500">0%</Text>
          <Text className="text-emerald-600 font-bold">{moistureThreshold}%</Text>
          <Text className="text-gray-500">100%</Text>
        </View>
      </View>
      
      {/* Info Text */}
      <View className="bg-gray-50 p-3 rounded-lg mt-2">
        <Text className="text-sm text-gray-600 italic">
          Hệ thống sẽ tự động tưới nước khi độ ẩm dưới {moistureThreshold}%
        </Text>
      </View>
    </View>
  );
};

export default SoilMoistureAdjust;