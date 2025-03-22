import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import HeaderDisplay from '../components/HeaderDisplay';
import WeatherDisplay from "../components/WeatherDisplay";
import LedController from "../components/LedController";
import SoilMoistureComponent from "../components/SoilMoistureAdjust";
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { apiUrl } from "../utils/ApiPath";
import { ActivityIndicator } from 'react-native';

export default function GardenPage() {
    const [devices, setDevices] = useState(null);
    const [loading, setLoading] = useState(true);   

    useFocusEffect(
        React.useCallback(() =>{
        const fetchDevice = async () => {
            setLoading(true);
            try {
                const token = await AsyncStorage.getItem('token'); 
                const response = await fetch(apiUrl + '/api/tenant/devices?pageSize=10&page=0', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    const devices = data.data;
                    for (let i = 0; i < devices.length; i++) {
                        const device = devices[i];
                        const _response = await fetch(apiUrl + `/api/device/info/${device.id.id}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Authorization': `Bearer ${token}`,
                            },
                        });
                        if (_response.ok) {
                            const data = await _response.json();
                            devices[i] = { ...device, ...data };
                        } else {
                            console.error("Failed to fetch device info:", _response.statusText);
                        }
                    }
                    setDevices(devices);
                    setLoading(false);
                } else {
                    console.error("Failed to fetch device ID:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching device ID", error);
            }
        };
        console.log("Fetching device...");
        fetchDevice();
    }, [])
    );

    return (
        <View className="p-0 m-0">
            <View className="fixed top-0 left-0 right-0 z-50">
                <HeaderDisplay/>
            </View>
            {/* <!-- hien thi tả ca trong devices --> */}
            <View>
                {
                    loading && (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#10b981" />
                        </View>
                    )
                }
                {devices && devices.map((device, index) => (
                    <View key={index}>
                        <View className={`flex p-4 ${device.active ? `bg-sky-800`: `bg-red-950`} m-4 rounded-lg`}>
                            <Text className="text-white font-black text-xl px-3 py-3">
                                {device ? `Thiết bị ${device.name}` : "Đang tải..."}
                                {device.active ? " (Hoạt động)" : " (Không hoạt động)"}
                            </Text>
                        </View>
                            {   
                                device && device.active && (
                                    <View>
                                        <View className="flex p-4">
                                            <Text className="text-gray-950 font-black text-xl px-3 py-3">Nhiệt độ, độ ẩm</Text>
                                            <WeatherDisplay device={device} />
                                        </View>
                                        <View className="flex p-4">
                                            <Text className="text-gray-950 font-black text-xl px-3 py-3">Bóng đèn</Text>
                                            <LedController device={device}/>
                                        </View>
                                        <View className="flex p-4">
                                            <Text className="text-gray-950 font-black text-xl px-3 py-3">Độ ẩm đất</Text>
                                            <SoilMoistureComponent device={device}/>
                                        </View>
                                    </View>
                            )}
                    </View>
                ))}
            </View>
        </View>
    );
}