import React, { useEffect, useState } from 'react';
import { ScrollView, SafeAreaView, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthPage from './src/pages/AuthPage';
import { enableScreens } from 'react-native-screens';
import GardenPage from './src/pages/GardenPage';
import { jwtDecode } from 'jwt-decode';
import { Alert } from 'react-native';
import ProfilePage from './src/pages/ProfilePage';
import { apiUrl } from './src/utils/ApiPath';
import { AuthenticatedProvider, useAuthenticated } from './src/contexts/AuthenticatedContext';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native';
import NotificationsPage from './src/pages/NotificationsPage';
import AddDeviceScreen from './src/pages/AddDevice';
import { Leaf, Settings, BarChart, User, Cpu, House } from 'lucide-react-native';
import DevicePage from './src/pages/DevicePage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './src/pages/HomePage';
import AddAsset from './src/pages/AddAsset';

enableScreens();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const GardenScreen = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="HomePage" 
      component={HomePage}
      options={{
        headerShown: false
      }}
    />
    <Stack.Screen 
      name="AddAsset" 
      component={AddAsset}
      options={{
        title: 'Thêm khung cảnh',
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#333',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    />
     <Stack.Screen 
        name="AddDevice" 
        component={AddDeviceScreen}
        options={{
          title: 'Thêm thiết bị mới',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
  </Stack.Navigator>
);

const ScenarioScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Devices" 
        component={DevicePage}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="AddDevice" 
        component={AddDeviceScreen}
        options={{
          title: 'Thêm thiết bị mới',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

const SmartScreen = () => (
    <NotificationsPage />
);

const ProfileScreen = () => (
  <ScrollView className="flex-1 bg-white" contentContainerStyle={styles.scrollContent}>
    <ProfilePage />
  </ScrollView>
);

function MainApp() {
  const { isAuthenticated, login, logout, loading } = useAuthenticated();

  return (
    <SafeAreaView className="flex-1 bg-white">
    {loading && (
      <View className="fixed z-10 w-full h-full justify-center items-center bg-white/80">
        <View className="relative">
          {/* Vòng ngoài pulse */}
          <View className="absolute animate-ping h-16 w-16 rounded-full border-4 border-t-[#2E7D32]/30 border-r-[#2E7D32]/30 border-b-transparent border-l-transparent" />
          {/* Vòng trong spin */}
          <View className="animate-spin h-16 w-16 rounded-full border-[6px] border-t-[#2E7D32] border-r-[#2E7D32] border-b-[#2E7D32]/20 border-l-[#2E7D32]/20" />
        </View>
        <Text className="text-[#2E7D32] mt-4 font-medium">Đang tải...</Text>
      </View>
    )}
      {isAuthenticated ? (
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Garden') {
                  return <House size={24} color={focused ? '#2E7D32' : '#777'} />;
                } else if (route.name === 'Thêm thiết bị') {
                  return <Cpu size={24} color={focused ? '#2E7D32' : '#777'} />;
                } else if (route.name === 'Thông báo') {
                  return <BarChart size={24} color={focused ? '#2E7D32' : '#777'} />;
                } else if (route.name === 'Profile') {
                  return <User size={24} color={focused ? '#2E7D32' : '#777'} />;
                }

                // return <Ionicons name="house" color="#ff0000" size={20} />
              },
              tabBarActiveTintColor: '#2E7D32',
              tabBarInactiveTintColor: '#757575',
              tabBarStyle: {
                backgroundColor: '#FFFFFF',
                borderTopWidth: 1,
                borderTopColor: '#E5E5EA',
                paddingTop: 5,
                paddingBottom: 5,
                height: 60,
              },
              tabBarLabelStyle: {
                fontSize: 12,
                marginBottom: 5,
              },
            })}
          >
            <Tab.Screen name="Garden" component={GardenScreen} options={{ tabBarLabel: 'Vườn', headerShown: false  }} />
            <Tab.Screen name="Thêm thiết bị" component={ScenarioScreen} options={{ tabBarLabel: 'Thiết bị', headerShown: false  }} />
            <Tab.Screen name="Thông báo" component={SmartScreen} options={{ tabBarLabel: 'Thông báo', headerShown: false  }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Tài khoản', headerShown: false  }} />
          </Tab.Navigator>
        </NavigationContainer>
      ) : (
        <AuthPage/>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthenticatedProvider>
      <MainApp />
    </AuthenticatedProvider>
  );
}

const styles = {
  scrollContent: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 80,
  },
};