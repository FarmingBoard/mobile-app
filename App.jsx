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
import { Leaf, Settings, BarChart, User, Cpu, House, Subscript, Superscript, Code } from 'lucide-react-native';
import DevicePage from './src/pages/DevicePage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './src/pages/HomePage';
import AddAsset from './src/pages/AddAsset';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import { getFCMToken, onNotificationReceived } from './src/services/firebaseService';
import DeviceSettings from './src/pages/DeviceSettings';
import ScriptPage from './src/pages/scripts/ScriptPage';
import SceneCreationScreen from './src/pages/scripts/CreateScript';
import ScheduleTimeScreen from './src/pages/scripts/ScheduleTime';
import CreateSceneScreen from './src/pages/scripts/CreateAddjustScript';
import { ScriptProvider } from './src/contexts/ScriptContext';
import WeatherOptions from './src/pages/scripts/WeatherOptions';
import TemperatureScreen from './src/pages/scripts/TemperatureScreen';
import HumidityScreen from './src/pages/scripts/HumidityScreen';
import WindScreen from './src/pages/scripts/WindScreen';
import WeatherScreen from './src/pages/scripts/WeatherScreen';
import SunScreen from './src/pages/scripts/SunScreen';
import DeviceTriggerScreen from './src/pages/scripts/deviceTrigger/TriggerDeviceScreen';
import OptionDeviceState from './src/pages/scripts/deviceTrigger/OptionDeviceState';
import DeviceParameterScreen from './src/pages/scripts/deviceTrigger/DeviceParameterScreen';
import NotificationAction from './src/pages/scripts/actionScript/NotificationAction';
import DeviceToggleAction from './src/pages/scripts/actionScript/DeviceToggleAction';
import ActionList from './src/pages/scripts/actionScript/ActionList';

// // Your secondary Firebase project credentials...
// const credentials = {
//   clientId: '1:302874682954:android:30bfc586b2242f3de1e8b3',
//   appId: '1:302874682954:android:30bfc586b2242f3de1e8b3',
//   apiKey: 'AIzaSyCaoieMkzft47idWg27uNzZvgzdkzOjyKM',
//   databaseURL: '',
//   storageBucket: 'smartfarm-fa60e.firebasestorage.app',
//   messagingSenderId: '302874682954',
//   projectId: 'smartfarm-fa60e',
// };

// const config = {
//   name: 'SECONDARY_APP',
// };

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
      <Stack.Screen 
        name="DeviceSettings" 
        component={DeviceSettings}
        options={{
          title: 'Cài đặt thiết bị',
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

const ScriptScreen = () => {
  return (
    <ScriptProvider>
    <Stack.Navigator>
      <Stack.Screen 
        name="Kịch bản" 
        component={ScriptPage}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="Tạo kịch bản" 
        component={SceneCreationScreen}
        options={{
          title: 'Chọn loại',
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
        name="Lên lịch"
        component={ScheduleTimeScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Thời tiết"
        component={WeatherOptions}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Nhiệt độ"
        component={TemperatureScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Độ ẩm"
        component={HumidityScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Gió"
        component={WindScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Trạng thái thời tiết"
        component={WeatherScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Mặt trời"
        component={SunScreen}
        options={{
          headerShown: false
        }}
      />  
      <Stack.Screen
        name="Điều kiện"
        component={CreateSceneScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Trạng thái thiết bị"
        component={DeviceTriggerScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Chọn trạng thái thiết bị"
        component={OptionDeviceState}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="DeviceParameterScreen"
        component={DeviceParameterScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="ActionList"
        component={ActionList}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="NotificationAction"
        component={NotificationAction}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="DeviceToggleAction"
        component={DeviceToggleAction}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
    </ScriptProvider>
  )
}

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
                } else if (route.name === 'Kịch bản') {
                  return <Code size={24} color={focused ? '#2E7D32' : '#777'} />;
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
            <Tab.Screen name="Kịch bản" component={ScriptScreen} options={{ tabBarLabel: 'Kịch bản', headerShown: false  }} />
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
  useEffect(() => {
    async function getTokenZ(){
      console.log("Get token", await getFCMToken());
      onNotificationReceived();
    }
    getTokenZ();
  })

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