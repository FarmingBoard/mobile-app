import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, TextInput, ScrollView } from 'react-native';
import { ArrowLeft, Send, Phone, MessageSquare } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useScript } from '../../../contexts/ScriptContext';

const SmsAction = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { actions, setActions } = useScript();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  // Xử lý nút lưu
  const handleSave = () => {
    if (!phoneNumber.trim() || !message.trim()) {
      // Hiển thị thông báo lỗi nếu cần
      return;
    }

    // Tạo action SMS
    const smsAction = {
      type: 'sms',
      phoneNumber: phoneNumber,
      message: message,
      label: `SMS đến: ${phoneNumber}`
    };
    
    // Thêm action vào context
    setActions(prev => {
      if (!prev) return [smsAction];
      return [...prev, smsAction];
    });
    
    // Quay lại trang tạo kịch bản
    navigation.navigate('CreateAddjustScript');
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
        <Text className="text-xl font-semibold">Gửi SMS</Text>
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
            <Phone size={20} color="#2196F3" />
            <Text className="text-lg font-semibold ml-2">Số điện thoại</Text>
          </View>
          
          <TextInput
            className="bg-gray-100 p-3 rounded-lg"
            placeholder="Nhập số điện thoại"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>
        
        <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <View className="flex-row items-center mb-2">
            <MessageSquare size={20} color="#2196F3" />
            <Text className="text-lg font-semibold ml-2">Nội dung tin nhắn</Text>
          </View>
          
          <TextInput
            className="bg-gray-100 p-3 rounded-lg"
            placeholder="Nhập nội dung tin nhắn"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>
        
        <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <Text className="text-base text-gray-700 mb-2">Biến có thể sử dụng:</Text>
          <View className="bg-gray-100 p-3 rounded-lg">
            <Text className="text-sm text-gray-600 mb-1">• {'{temp}'} - Nhiệt độ hiện tại</Text>
            <Text className="text-sm text-gray-600 mb-1">• {'{humidity}'} - Độ ẩm hiện tại</Text>
            <Text className="text-sm text-gray-600 mb-1">• {'{device_name}'} - Tên thiết bị</Text>
            <Text className="text-sm text-gray-600 mb-1">• {'{time}'} - Thời gian hiện tại</Text>
            <Text className="text-sm text-gray-600">• {'{date}'} - Ngày hiện tại</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SmsAction;
