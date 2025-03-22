
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert, Switch } from "react-native"
import { useAuthenticated } from "../contexts/AuthenticatedContext";
import { useEffect } from "react";
import { apiUrl } from "../utils/ApiPath";

// Note: If you're having issues with Lucide icons, let's use simple text icons as a fallback
// Remove the Lucide imports if they're causing problems

export default function App() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const { logout } = useAuthenticated();
  const [userProfile, setUserProfile] = useState({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(apiUrl + '/api/auth/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        } else {
          console.error('Failed to fetch user profile:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đăng xuất",
        onPress: () => {
          // xoa token
          AsyncStorage.removeItem('token');
          // chuyen huong sang trang login
          logout();
          console.log("Đã đăng xuất")
        },
        style: "destructive",
      },
    ])
  }

  const handleDeviceUpdate = () => {
    Alert.alert("Cập nhật phần mềm", "Có phiên bản mới cho thiết bị của bạn. Bạn có muốn cập nhật ngay?", [
      {
        text: "Để sau",
        style: "cancel",
      },
      {
        text: "Cập nhật ngay",
        onPress: () => console.log("Update initiated"),
      },
    ])
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 py-3 flex-row justify-between items-center">
          <View className="flex-row items-center flex-1">
            <View className="w-16 h-16 rounded-full bg-gray-200 items-center justify-center">
              <Text className="text-2xl">👤</Text>
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold">{userProfile?.firstName} {userProfile?.lastName}</Text>
              <Text className="text-gray-500 text-sm">Email: {userProfile?.email}</Text>
            </View>
            <TouchableOpacity
              className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
              onPress={() => Alert.alert("Thông báo", "Bạn có 3 thông báo mới")}
            >
              <Text>🔔</Text>
              <View className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Feature Cards */}
        <View className="flex-row px-5 py-4">
          <TouchableOpacity
            className="flex-1 items-center mr-2 p-5 bg-white rounded-xl shadow-sm border border-gray-100 elevation-2"
            onPress={() => Alert.alert("Quản lý thiết bị", "Đang mở quản lý thiết bị")}
          >
            <View className="w-12 h-12 bg-red-50 rounded-full items-center justify-center mb-2">
              <Text className="text-2xl">📱</Text>
            </View>
            <Text className="text-center font-medium">Thông tin</Text>
          </TouchableOpacity>
    
          <TouchableOpacity
            className="flex-1 items-center ml-2 p-5 bg-white rounded-xl shadow-sm border border-gray-100 elevation-2"
            onPress={() => Alert.alert("Dịch vụ", "Đang mở dịch vụ bên thứ ba")}
          >
            <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center mb-2">
              <Text className="text-2xl">🔄</Text>
            </View>
            <Text className="text-center font-medium">Tư vấn</Text>
          </TouchableOpacity>
        </View>

        {/* Menu List */}
        <View className="px-5 mt-2 bg-white rounded-xl mx-4 shadow-sm border border-gray-100 elevation-1">
          <MenuItem icon="🛠️" text="Thêm công cụ" onPress={() => Alert.alert("Công cụ", "Đang mở thêm công cụ")} />
          <MenuItem icon="🏠" text="Quản lý nhà" onPress={() => Alert.alert("Nhà", "Đang mở quản lý nhà")} />
          <MenuItem icon="⚡" text="Cập nhật phần mềm thiết bị" showDot onPress={handleDeviceUpdate} />
          <MenuItem icon="⭐" text="Đánh giá" onPress={() => Alert.alert("Đánh giá", "Vui lòng đánh giá ứng dụng")} />
        </View>   

        {/* Settings Section */}
        <View className="px-5 mt-4 bg-white rounded-xl mx-4 shadow-sm border border-gray-100 elevation-1">
          <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3">
                <Text>🔔</Text>
              </View>
              <Text className="text-base">Thông báo</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#e0e0e0", true: "#f96060" }}
              thumbColor="#ffffff"
            />
          </View>

          <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3">
                <Text>⚙️</Text>
              </View>
              <Text className="text-base">Chế độ tối</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#e0e0e0", true: "#f96060" }}
              thumbColor="#ffffff"
            />
          </View>

          <MenuItem icon="🚪" text="Đăng xuất" textColor="text-red-500" onPress={handleLogout} />
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  )
}

// Menu Item Component
const MenuItem = ({ icon, text, showDot = false, onPress, textColor = "text-gray-800" }) => {
  return (
    <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-100" onPress={onPress}>
      <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3">
        <Text>{icon}</Text>
      </View>
      <Text className={`flex-1 ${textColor}`}>{text}</Text>
      <View className="flex-row items-center">
        {showDot && <View className="w-2 h-2 rounded-full bg-red-500 mr-2" />}
        <Text className="text-gray-400 text-lg">›</Text>
      </View>
    </TouchableOpacity>
  )
}
