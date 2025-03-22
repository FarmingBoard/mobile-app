// NotificationsScreen.tsx
import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { 
  Bell, 
  AlertTriangle, 
  ThermometerHot, 
  Info, 
  ChevronDown, 
  ArrowLeft,
  BellRing,
  BellOff
} from "lucide-react-native";
import { format, formatDistanceToNow } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiUrl } from "../utils/ApiPath";

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = async (pageNum = 0, refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
        setPage(0);
        pageNum = 0;
      } else if (!refresh && pageNum === 0) {
        setLoading(true);
      }

      const token = await AsyncStorage.getItem('token');

      const response = await fetch(
        `${apiUrl}/api/notifications?pageSize=10&page=${pageNum}&unreadOnly=false`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Fail ed to fetch notifications");
      }

      const data = await response.json();
      if (data.data && data.data.length > 0) {
        if (refresh || pageNum === 0) {
          setNotifications(data.data);
        } else {
          setNotifications((prev) => [...prev, ...data.data]);
        }
        setHasMore(data.data.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = () => {
    fetchNotifications(0, true);
  };

  const loadMore = () => {
    if (hasMore && !loading && !refreshing) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return {
          icon: "#ef4444",
          bg: "#fee2e2",
          text: "#b91c1c"
        };
      case "MAJOR":
        return {
          icon: "#f97316",
          bg: "#ffedd5",
          text: "#c2410c"
        };
      case "MINOR":
        return {
          icon: "#eab308",
          bg: "#fef9c3",
          text: "#a16207"
        };
      default:
        return {
          icon: "#6b7280",
          bg: "#f3f4f6",
          text: "#374151"
        };
    }
  };

  const renderNotificationIcon = (notification) => {
    const severity = notification.info?.alarmSeverity;
    const colors = getSeverityColor(severity);

    if (notification.type === "ALARM") {
      return (
        <View className={`w-10 h-10 rounded-full items-center justify-center`} style={{ backgroundColor: colors.bg }}>
          <AlertTriangle size={20} color={colors.icon} />
        </View>
      );
    }

    if (notification.subject.includes("Temperature")) {
      return (
        <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center">
          <ThermometerHot size={20} color="#ef4444" />
        </View>
      );
    }

    // Default icon
    return (
      <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
        <Bell size={20} color="#3b82f6" />
      </View>
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    // If it's today, show relative time (e.g., "2 hours ago")
    if (date.toDateString() === now.toDateString()) {
      return formatDistanceToNow(date, { addSuffix: true });
    }

    // Otherwise show the date
    return format(date, "MMM d, yyyy • h:mm a");
  };

  const renderNotification = ({ item }) => {
    const severity = item.info?.alarmSeverity;
    const colors = getSeverityColor(severity);
    
    return (
      <TouchableOpacity
        className="bg-white mb-3 rounded-xl overflow-hidden shadow-sm border border-gray-100"
        activeOpacity={0.7}
      >
        <View className="p-4">
          <View className="flex-row"> 
            <View className="mr-3">{renderNotificationIcon(item)}</View>
            <View className="flex-1">
              <Text className="font-bold text-gray-800 text-base mb-1">{item.subject}</Text>
              <Text className="text-gray-600 mb-2">{item.text}</Text>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500 text-xs">{formatTimestamp(item.createdTime)}</Text>
                {severity && (
                  <View
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: colors.bg }}
                  >
                    <Text
                      className="text-xs font-medium"
                      style={{ color: colors.text }}
                    >
                      {severity.charAt(0) + severity.slice(1).toLowerCase()}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!hasMore) return null;

    return (
      <View className="py-4 items-center justify-center">
        {loading ? (
          <ActivityIndicator size="small" color="#10b981" />
        ) : (
          <TouchableOpacity 
            onPress={loadMore} 
            className="flex-row items-center bg-emerald-50 px-4 py-2 rounded-full"
          >
            <Text className="text-emerald-600 mr-1 font-medium">Xem thêm</Text>
            <ChevronDown size={16} color="#10b981" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading && !refreshing && notifications.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View className="bg-white pt-4 pb-4 px-5 shadow-sm">
          <View className="flex-row items-center">
            <Text className="text-xl font-bold text-gray-800">Thông báo</Text>
          </View>
        </View>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="mt-4 text-gray-600">Đang tải thông báo...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View className="bg-white pt-4 pb-4 px-5 shadow-sm">
          <View className="flex-row items-center">
            <Text className="text-xl font-bold text-gray-800">Thông báo</Text>
          </View>
        </View>
        <View className="flex-1 justify-center items-center p-4">
          <View className="w-16 h-16 rounded-full bg-red-100 items-center justify-center mb-4">
            <Info size={32} color="#ef4444" />
          </View>
          <Text className="text-lg font-bold text-gray-800 mb-2">Lỗi tải thông báo</Text>
          <Text className="text-gray-600 text-center">{error}</Text>
          <TouchableOpacity 
            className="mt-6 bg-emerald-500 py-3 px-6 rounded-xl" 
            onPress={onRefresh}
          >
            <Text className="text-white font-medium">Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View className="bg-white pt-4 pb-4 px-5 shadow-sm">
        <View className="flex-row items-center">
          <Text className="text-xl font-bold text-gray-800">Thông báo</Text>
        </View>
      </View>
      
      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={["#10b981"]}
            tintColor="#10b981"
          />
        }
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
              <BellOff size={32} color="#9ca3af" />
            </View>
            <Text className="text-gray-600 text-lg mb-2">Không có thông báo</Text>
            <Text className="text-gray-500 text-center">Kéo xuống để làm mới</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}