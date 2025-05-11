
// WeatherDisplay.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Thermometer, Droplet, Wind, PlugZap, PlugIcon } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl, ipHost } from '../../utils/ApiPath';
import AirSensor from '../ui/AirSensor';
import WeatherDisplay from '../WeatherDisplay';


export default function AIR({ device }) {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [ppm, setPpm] = useState(0);
  const [pin_1, setPin_1] = useState(0);
  const [pin_2, setPin_2] = useState(0);
  const [pin_3, setPin_3] = useState(0);

  
  async function pressPlugin(pluginNumber, value) {
    console.log("Plugin pressed");
    const deviceId = device?.id;
    if (!deviceId) return;

    const key = `pin_${pluginNumber}`;
    
    try {
      const accessToken = await AsyncStorage.getItem("token");
      
      const response = await fetch(`${apiUrl}/api/plugins/telemetry/${deviceId}/SHARED_SCOPE`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          [key]: value,
        }),
      });
    
      if (response.ok) {
        if (pluginNumber === 1) {
          setPin_1(value);
        } else if (pluginNumber === 2) {
          setPin_2(value);
        } else if (pluginNumber === 3) {
          setPin_3(value);
        }
        console.log("Light state updated successfully");
      } else {
        console.error("Failed to update light state:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating light state:", error);
    }
  }


  useEffect(() => {
        const fetchDeviceData = async () => {
      try {
        const deviceId = device?.id;
        if (!deviceId) return;
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('Token not found');
          return;
        }
        const response = await fetch(`${apiUrl}/api/plugins/telemetry/DEVICE/${deviceId}/values/attributes/SHARED_SCOPE?keys=pin_1,pin_2,pin_3`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-Authorization': `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          console.error('Failed to fetch device data:', response);
          return;
        }
        const data = await response.json();
        console.log(data);
        if (data) {
          console.log(data);
          const pin1Data = data.find(item => item.key === 'pin_1');
          if (pin1Data) {
            setPin_1(pin1Data.value);
          }
          const pin2Data = data.find(item => item.key === 'pin_2');
          if (pin2Data) {
            setPin_2(pin2Data.value);
          }
          const pin3Data = data.find(item => item.key === 'pin_3');
          if (pin3Data) {
            setPin_3(pin3Data.value);
          }
        }
      } catch (error) {
        console.error('Error fetching device data:', error);
      }
    };
    fetchDeviceData();
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
         <DeviceSection
          title="Đầu ra" 
          icon={<PlugIcon size={18} color="#059669"  />}
          >
          <View className='flex-row items-center justify-between'>
            <TouchableOpacity
              onPress={() => pressPlugin(1, !pin_1)}
              className={`w-16 h-16 rounded-full items-center justify-center ${pin_1 == 1 ? 'bg-green-500' : 'bg-gray-300'}`}
            >
                <PlugZap 
                size={28}
                />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => pressPlugin(2, !pin_2)}
              className={`w-16 h-16 rounded-full items-center justify-center ${pin_2 == 1 ? 'bg-green-500' : 'bg-gray-300'}`}
            >
                <PlugZap 
                size={28}
                />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => pressPlugin(3, !pin_3)}
              className={`w-16 h-16 rounded-full items-center justify-center ${pin_3 == 1 ? 'bg-green-500' : 'bg-gray-300'}`}
            >
                <PlugZap 
                size={28}
                />
            </TouchableOpacity>
          </View>
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