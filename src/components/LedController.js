// LedController.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Lightbulb } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl } from '../utils/ApiPath';

export default function LedController({ device }) {
  const [isOn, setIsOn] = useState(false);
  
  // Fetch initial state if needed
  useEffect(() => {
    // Add code to fetch initial state if available
  }, []);

  const updateLightState = async () => {
    const deviceId = device?.id;
    if (!deviceId) return;
    
    try {
      const accessToken = await AsyncStorage.getItem("token");
      
      const response = await fetch(`${apiUrl}/api/plugins/telemetry/${deviceId}/SHARED_SCOPE`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          lightState: !isOn
        }),
      });
    
      if (response.ok) {
        setIsOn(!isOn);
        console.log("Light state updated successfully");
      } else {
        console.error("Failed to update light state:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating light state:", error);
    }
  };

  return (
    <View className="flex-row justify-between items-center bg-white rounded-xl p-4 shadow-sm">
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-700 mb-1">Đèn LED</Text>
        <Text className="text-sm text-gray-500">
          {isOn ? 'Đèn đang bật' : 'Đèn đang tắt'}
        </Text>
      </View>
      
      <TouchableOpacity
        onPress={updateLightState}
        className={`w-16 h-16 rounded-full items-center justify-center ${
          isOn ? 'bg-amber-100' : 'bg-gray-100'
        }`}
      >
        <Lightbulb 
          size={28} 
          color={isOn ? '#f59e0b' : '#9ca3af'} 
          fill={isOn ? '#fbbf24' : 'transparent'}
        />
      </TouchableOpacity>
    </View>
  );
}