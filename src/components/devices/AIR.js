
// WeatherDisplay.js
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Thermometer, Droplet, Wind } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ipHost } from '../../utils/ApiPath';
import AirSensor from '../ui/AirSensor';
import WeatherDisplay from '../WeatherDisplay';


export default function AIR({ device }) {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [ppm, setPpm] = useState(0);

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
            if (latestData.temperature) {
              setTemperature(latestData.temperature[0][1]);
            }
            if (latestData.humidity) {
              setHumidity(latestData.humidity[0][1]);
            }
            if(latestData.air_quality) {
                setPpm(latestData.air_quality[0][1]);
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
                title="Nhiệt độ & Độ ẩm" 
                icon={<Thermometer size={18} color="#059669" />}
              >
                <WeatherDisplay temperature={temperature} humidity={humidity} />
        </DeviceSection>  
        <DeviceSection 
                title="Không khí" 
                icon={<Wind size={18} color="#059669" />}
              >
                <AirSensor ppm={ppm}/>
        </DeviceSection>
    </View>
  );
}

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