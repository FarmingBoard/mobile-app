// DevicePage.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  StatusBar,
} from 'react-native';
import { useGetDevices } from '../hooks/useGetDevices';
import { apiUrl } from '../utils/ApiPath';
import { Edit2, Trash2, Plus, Smartphone, ArrowLeft } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import CircleSpinner from '../components/CircleSpinner';

const DevicePage = () => {
  const { 
    devices, 
    loading, 
    refreshing, 
    error, 
    refresh, 
    loadMore, 
    hasMore, 
    loadingMore 
  } = useGetDevices();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [editingDevice, setEditingDevice] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigation = useNavigation();

  const editDevice = async () => {
    if (!deviceName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên thiết bị');
      return;
    }
    setIsProcessing(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/device/${editingDevice.id.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: deviceName }),
      });
      if (response.ok) {
        refresh();
        setEditModalVisible(false);
        setEditingDevice(null);
        setDeviceName('');
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật thiết bị');
      }
    } catch (error) {
      console.error('Error editing device:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật thiết bị');
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteDevice = async (deviceId) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa thiết bị này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            setIsProcessing(true);
            try {
              const token = await AsyncStorage.getItem('token');
              const response = await fetch(`${apiUrl}/api/device-z/${deviceId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Authorization': `Bearer ${token}`,
                },
              });
              if (response.ok) {
                refresh();
              } else {
                Alert.alert('Lỗi', 'Không thể xóa thiết bị');
              }
            } catch (error) {
              console.error('Error deleting device:', error);
              Alert.alert('Lỗi', 'Đã xảy ra lỗi khi xóa thiết bị');
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  const renderDeviceItem = ({ item }) => (
    <View className="bg-white rounded-xl mb-3 shadow-sm overflow-hidden border border-gray-100">
      <View className="flex-row justify-between items-center p-4">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 rounded-full bg-emerald-100 items-center justify-center mr-3">
            <Smartphone size={20} color="#059669" />
          </View>
          <View className="flex-1">
            <Text className="text-gray-800 font-bold text-base">{item.name}</Text>
            <Text className="text-gray-500 text-xs mt-1">ID: {item.id.id}</Text>
          </View>
        </View>
        
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => {
              setEditingDevice(item);
              setDeviceName(item.name);
              setEditModalVisible(true);
            }}
            className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center mr-2"
          >
            <Edit2 size={16} color="#4b5563" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteDevice(item.id.id)}
            className="w-9 h-9 rounded-full bg-red-50 items-center justify-center"
          >
            <Trash2 size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View className="py-4 items-center">
        <CircleSpinner size={30} color="#10b981" />
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-slate-50">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View className="bg-white pt-4 pb-4 px-5 shadow-sm">
          <View className="flex-row items-center">
            {/* <TouchableOpacity 
              onPress={() => navigation.goBack()}
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
            >
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity> */}
            <Text className="text-xl font-bold text-gray-800">Danh sách thiết bị</Text>
          </View>
        </View>
        <View className="flex-1 justify-center items-center">
          <CircleSpinner size={50} color="#10b981" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View className="bg-white pt-4 pb-4 px-5 shadow-sm">
        <View className="flex-row items-center">
          {/* <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
          >
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity> */}
          <Text className="text-xl font-bold text-gray-800">Danh sách thiết bị</Text>
        </View>
      </View>
      
      {/* Device List */}
      <FlatList
        data={devices}
        renderItem={renderDeviceItem}
        keyExtractor={(item) => String(item.id.id)}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={['#10b981']}
            tintColor="#10b981"
          />
        }
        ListEmptyComponent={
          <View className="py-16 items-center justify-center">
            <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
              <Smartphone size={32} color="#9ca3af" />
            </View>
            <Text className="text-gray-500 text-center text-base">
              {error || 'Chưa có thiết bị nào'}
            </Text>
            <TouchableOpacity
              className="mt-4 bg-emerald-100 px-4 py-2 rounded-full"
              onPress={() => navigation.navigate('AddDevice')}
            >
              <Text className="text-emerald-700 font-medium">Thêm thiết bị mới</Text>
            </TouchableOpacity>
          </View>
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-emerald-500 rounded-full items-center justify-center shadow-lg z-50 elevation-5"
        onPress={() => navigation.navigate('AddDevice')}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>

      {/* Edit Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-6 w-10/12 shadow-xl">
            <Text className="text-xl font-bold text-gray-800 mb-5 text-center">Đổi tên thiết bị</Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-4 py-3 text-base mb-6 bg-gray-50"
              onChangeText={setDeviceName}
              value={deviceName}
              placeholder="Nhập tên thiết bị"
              autoFocus
              editable={!isProcessing}
            />
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-gray-200 rounded-xl py-3 px-5 flex-1 mr-3"
                onPress={() => {
                  setEditModalVisible(false);
                  setDeviceName('');
                  setEditingDevice(null);
                }}
                disabled={isProcessing}
              >
                <Text className="text-gray-700 font-bold text-center">Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-emerald-500 rounded-xl py-3 px-5 flex-1"
                onPress={editDevice}
                disabled={isProcessing}
              >
                <Text className="text-white font-bold text-center">Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {isProcessing && (
        <View className="absolute inset-0 bg-black/30 items-center justify-center z-50">
          <View className="bg-white p-4 rounded-2xl">
            <CircleSpinner size={40} color="#10b981" />
          </View>
        </View>
      )}
    </View>
  );
};

export default DevicePage;