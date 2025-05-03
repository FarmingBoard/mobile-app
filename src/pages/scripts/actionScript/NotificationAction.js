import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, TextInput, ScrollView, Switch } from 'react-native';
import { ArrowLeft, Bell } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useScript } from '../../../contexts/ScriptContext';

const NotificationAction = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { actions, setActions } = useScript();
  
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('normal'); // 'low', 'normal', 'high'
  const [vibration, setVibration] = useState(true);
  const [sound, setSound] = useState(true);

  // Xử lý nút lưu
  const handleSave = () => {
    if (!title.trim() || !message.trim()) {
      // Hiển thị thông báo lỗi nếu cần
      return;
    }

    // Tạo action thông báo
    const notificationAction = {
      type: 'notification',
      title: title,
      message: message,
      priority: priority,
      vibration: vibration,
      sound: sound,
      label: `Thông báo: ${title}`
    };
    
    // Thêm action vào context
    setActions(prev => {
      if (!prev) return [notificationAction];
      return [...prev, notificationAction];
    });
    
    // Quay lại trang tạo kịch bản
    navigation.navigate('CreateAddjustScript');
  };

  // Xử lý thay đổi mức độ ưu tiên
  const handlePriorityChange = (newPriority) => {
    setPriority(newPriority);
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
          
          <Text className="text-sm text-gray-700 mb-2">Tiêu đề</Text>
          <TextInput
            className="bg-gray-100 p-3 rounded-lg mb-4"
            placeholder="Nhập tiêu đề thông báo"
            value={title}
            onChangeText={setTitle}
          />
          
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
        
        <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <Text className="text-lg font-semibold mb-3">Mức độ ưu tiên</Text>
          
          <View className="flex-row justify-between mb-4">
            <TouchableOpacity 
              className={`flex-1 p-3 rounded-lg mr-2 ${priority === 'low' ? 'bg-blue-100 border border-blue-400' : 'bg-gray-100'}`}
              onPress={() => handlePriorityChange('low')}
            >
              <Text className={`text-center ${priority === 'low' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>Thấp</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className={`flex-1 p-3 rounded-lg mx-1 ${priority === 'normal' ? 'bg-green-100 border border-green-400' : 'bg-gray-100'}`}
              onPress={() => handlePriorityChange('normal')}
            >
              <Text className={`text-center ${priority === 'normal' ? 'text-green-600 font-medium' : 'text-gray-600'}`}>Bình thường</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className={`flex-1 p-3 rounded-lg ml-2 ${priority === 'high' ? 'bg-red-100 border border-red-400' : 'bg-gray-100'}`}
              onPress={() => handlePriorityChange('high')}
            >
              <Text className={`text-center ${priority === 'high' ? 'text-red-600 font-medium' : 'text-gray-600'}`}>Cao</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <Text className="text-lg font-semibold mb-3">Tùy chọn thêm</Text>
          
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base text-gray-700">Rung</Text>
            <Switch
              value={vibration}
              onValueChange={setVibration}
              trackColor={{ false: '#D1D5DB', true: '#4CAF50' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View className="flex-row justify-between items-center">
            <Text className="text-base text-gray-700">Âm thanh</Text>
            <Switch
              value={sound}
              onValueChange={setSound}
              trackColor={{ false: '#D1D5DB', true: '#4CAF50' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationAction;
