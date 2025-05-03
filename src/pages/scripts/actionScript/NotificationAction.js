import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, TextInput, ScrollView, Switch } from 'react-native';
import { ArrowLeft, Bell } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useScript } from '../../../contexts/ScriptContext';

const NotificationAction = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { actions, setActions } = useScript();
  
  const [message, setMessage] = useState('');

  // Xử lý nút lưu
  const handleSave = () => {
    if (!message.trim()) {
      // Hiển thị thông báo lỗi nếu cần
      return;
    }

    // Tạo action thông báo
    const notificationAction = {
      CMD: 'PUSH_NOTIFY',
      params: [{
        title: message
      }]
    };
    
    // Thêm action vào context
    setActions(prev => {
      if(prev == null) prev = [];
      const index = prev.findIndex(action => action.CMD === 'PUSH_NOTIFY');
      if(index === -1) {
        prev.push(notificationAction);
      } else {
        prev[index] = notificationAction;
      }
      return prev;
    });
    
    // Quay lại trang tạo kịch bản
    navigation.navigate('Điều kiện');
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full mr-4"
        >
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold">Thông báo</Text>
        <View className="flex-1" />
        <TouchableOpacity 
          onPress={handleSave}
          className="px-4 py-2 bg-green-500 rounded-lg"
        >
          <Text className="text-white font-medium">Lưu</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView className="flex-1 p-4">
        <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <View className="flex-row items-center mb-2">
            <Bell size={20} color="#FF9800" />
            <Text className="text-lg font-semibold ml-2">Thông tin thông báo</Text>
          </View>
          <Text className="text-sm text-gray-700 mb-2">Nội dung</Text>
          <TextInput
            className="bg-gray-100 p-3 rounded-lg mb-4"
            placeholder="Nhập nội dung thông báo"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationAction;
