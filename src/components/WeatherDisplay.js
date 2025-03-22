// WeatherDisplay.js
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Thermometer, Droplet } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ipHost } from '../utils/ApiPath';
import AirSensor from './ui/AirSensor';
import RainSensor from './ui/RainSensor';

export default function WeatherDisplay({ temperature, humidity}) {
  return (
    <View className="flex-row justify-between bg-white rounded-xl shadow-sm">
      {/* Temperature Card */}
      <View className="flex-1 p-4 border-r border-gray-100">
        <View className="items-center">
          <View className="w-12 h-12 rounded-full bg-red-100 items-center justify-center mb-2">
            <Thermometer size={24} color="#ef4444" />
          </View>
          <Text className="text-2xl font-bold text-gray-800">{temperature}°C</Text>
          <Text className="text-sm text-gray-500 mt-1">Nhiệt độ</Text>
        </View>
      </View>
      
      {/* Humidity Card */}
      <View className="flex-1 p-4">
        <View className="items-center">
          <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mb-2">
            <Droplet size={24} color="#3b82f6" />
          </View>
          <Text className="text-2xl font-bold text-gray-800">{humidity}%</Text>
          <Text className="text-sm text-gray-500 mt-1">Độ ẩm</Text>
        </View>
      </View>
    </View>
  );
}