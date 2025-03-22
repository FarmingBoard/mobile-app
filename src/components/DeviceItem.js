// DeviceItem.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Cpu, ChevronDown, ChevronUp, Thermometer, Droplet, Sun, Cloud, Wind } from 'lucide-react-native';
import WeatherDisplay from './WeatherDisplay';
import LedController from './LedController';
import SoilMoistureAdjust from './SoilMoistureAdjust';
import RainSensor from './ui/RainSensor';
import AirSensor from './ui/AirSensor';
import deviceType from '../types/DeviceType';
import AIR from './devices/AIR';
import LIGHT_RAIN from './devices/LIGHT_RAIN'
import SOIL_MOISTURE from './devices/SOIL_MOISTURE'
import RC522_MODULE from './devices/RC522_MODULE'

const DeviceItem = ({ device }) => {
  const [expanded, setExpanded] = useState(false);

  const isActive = device?.active;
  
  return (
    <View className="mb-4 overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
      {/* Device header */}
      <TouchableOpacity 
        className="flex-row items-center justify-between p-4"
        onPress={() => isActive && setExpanded(!expanded)}
        activeOpacity={isActive ? 0.7 : 1}
      >
        <View className="flex-row items-center">
          <View className={`w-10 h-10 rounded-full items-center justify-center ${isActive ? 'bg-emerald-100' : 'bg-gray-100'}`}>
            <Cpu size={20} color={isActive ? '#059669' : '#9ca3af'} />
          </View>
          <View className="ml-3">
            <Text className={`font-bold text-lg ${isActive ? 'text-gray-800' : 'text-gray-400'}`}>
              {device?.name}
            </Text>
            <View className="flex-row items-center mt-1">
              <View className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              <Text className={`ml-1.5 text-xs ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                {isActive ? "Đang hoạt động" : "Không hoạt động"} | {deviceType.get(device?.device_type)}
              </Text>
            </View>
          </View>
        </View>
        
        {isActive && (
          <View className="w-8 h-8 items-center justify-center">
            {expanded ? (
              <ChevronUp size={20} color="#059669" />
            ) : (
              <ChevronDown size={20} color="#059669" />
            )}
          </View>
        )}
      </TouchableOpacity>
      
      {/* Device details (expanded view) */}
      {isActive && expanded && (
        <View className="border-t border-gray-100 pt-2 pb-4">
          {/* Weather section */}
          {
              device?.device_type == 'AIR' && (
                <AIR device={device} />
              )
          }

          {
              device?.device_type == 'LIGHT_RAIN' && (
                <LIGHT_RAIN device={device} />
              )
          }

          {
              device?.device_type == 'SOIL' && (
                <SOIL_MOISTURE device={device} />
              )
          }

          
          {/* LED section */}
          { device?.device_type != 'RC522_MODULE' && (
            <DeviceSection 
              title="Bóng đèn" 
              icon={<Sun size={18} color="#059669" />}
          >
              <LedController device={device} />
            </DeviceSection>
          )}

          {
              device?.device_type == 'RC522_MODULE' && (
                <RC522_MODULE device={device} />
              )
          }
          
          
          {/* Pump section */}
          {/* <DeviceSection 
            title="Máy bơm" 
            icon={<Droplet size={18} color="#059669" />}
          >
            <SoilMoistureAdjust device={device} />
          </DeviceSection> */}
          
          {/* Rain section */}
          {/* <DeviceSection 
            title="Lượng mưa" 
            icon={<Cloud size={18} color="#059669" />}
          >
            <RainSensor device={device} />
          </DeviceSection> */}
          
        </View>
      )}
    </View>
  );
};

// Helper component for device sections
const DeviceSection = ({ title, icon, children }) => {
  return (
    <View className="px-4 pt-4">
      <View className="flex-row items-center mb-2">
        <View className="w-6 h-6 items-center justify-center">
          {icon}
        </View>
        <Text className="text-gray-800 font-bold text-base ml-2">
          {title}
        </Text>
      </View>
      <View className="ml-8">
        {children}
      </View>
    </View>
  );
};

export default DeviceItem;