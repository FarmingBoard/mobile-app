
// WeatherDisplay.js
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Thermometer, Droplet, Wind, Lightbulb, Rainbow } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ipHost } from '../../utils/ApiPath';
import AirSensor from '../ui/AirSensor';
import WeatherDisplay from '../WeatherDisplay';


export default function LIGHT_RAIN({ device }) {
  const [lightSensor, setLightSensor] = useState(0);
  const [rainSensor, setRainSensor] = useState(0);

  useEffect(() => {
    const fetchTokenAndConnect = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('Token not found');
          return;
        }

        const ws = new WebSocket(`ws://${ipHost}:8080/api/ws/plugins/telemetry?token=${token}`);

        ws.onopen = () => {
          console.log('WebSocket connection established');
          const subscriptionMessage = {
            tsSubCmds: [
              {
                entityType: 'DEVICE',
                entityId: device.id,
                scope: 'LATEST_TELEMETRY',
              },
            ],
            historyCmds: [],
          };
          ws.send(JSON.stringify(subscriptionMessage));
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.data) {
            const latestData = data.data;
            console.log(latestData)
            if (latestData.light) {
              setLightSensor(300 - latestData.light[0][1]);
            }
            if (latestData.rain) {
              setRainSensor(400 - latestData.rain[0][1]);
            }
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error.message);
        };

        ws.onclose = () => {
          console.log('WebSocket connection closed');
        };

        return () => {
          ws.close();
        };
      } catch (error) {
        console.error('Error fetching token or connecting WebSocket:', error);
      }
    };

    fetchTokenAndConnect();
  }, [device]);

  return (
    <View>
        <DeviceSection 
                title="Ánh sáng" 
                icon={<Lightbulb size={18} color="#059669" />}
              >
                <LightSensor light={lightSensor} />
        </DeviceSection>
        <DeviceSection
                title="Lượng mưa" 
                icon={<Rainbow size={18} color="#059669" />}
              >
                <RainSensor rain={rainSensor} />
        </DeviceSection>
    </View>
  );
}

const LightSensor = ({ light }) => {
  return (
    <View className="flex-row items-center">
      <View className='w-9/12 bg-sky-200 round-lg'>
        <View
            style={{
            width: `${(light) / 300 * 100}%`,
            height: 8,
            backgroundColor: `${light > 150 ? '#059669' : light > 50 ? '#facc15' : '#ef4444'}`,
            borderRadius: 4,
            }}
        />
      </View>
      <Text className="text-gray-800 font-bold text-base ml-4 w-full">
        {light}/300
      </Text>
    </View>
  );
};

const RainSensor = ({ rain }) => {
  return (
    <View className="flex-row items-center">
    <View className='w-9/12 bg-sky-200 round-lg'>
      <View
        style={{
          width: `${(rain) / 400 * 100}%`,
          height: 8,
          backgroundColor: `${rain > 200 ? '#059669' : rain > 100 ? '#facc15' : '#ef4444'}`,
          borderRadius: 4,
        }}
      />
      </View>
      <Text className="text-gray-800 font-bold text-base ml-4 w-full">
        {rain}/400
      </Text>
    </View>
  );
};

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