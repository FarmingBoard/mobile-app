import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, FlatList, TextInput } from 'react-native';
import { ArrowLeft, MessageSquare, Cpu, Bell, Send, Power, ChevronRight, Droplet, Thermometer, Sun, Cloud } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useScript } from '../../../contexts/ScriptContext';

const ActionList = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { actions, setActions } = useScript();
  const [searchQuery, setSearchQuery] = useState('');

  // Danh sách các action có thể thực hiện
  const actionCategories = [
    {
      id: 'message',
      title: 'Gửi tin nhắn',
      description: 'Gửi thông báo hoặc tin nhắn',
      icon: MessageSquare,
      color: '#4CAF50',
      actions: [
        {
          id: 'notification',
          label: 'Gửi thông báo',
          description: 'Gửi thông báo đến thiết bị của bạn',
          icon: Bell,
          color: '#FF9800',
          screen: 'NotificationAction'
        },
        {
          id: 'sms',
          label: 'Gửi SMS',
          description: 'Gửi tin nhắn SMS đến số điện thoại',
          icon: Send,
          color: '#2196F3',
          screen: 'SmsAction'
        }
      ]
    },
    {
        id: 'device',
        title: 'Điều khiển thiết bị',
        description: 'Điều khiển thiết bị',
        icon: Cpu,
        color: '#FF5722',
        actions: [
          {
            id: 'toggle',
            label: 'Bật/Tắt kênh thiết bị',
            description: 'Bật hoặc tắt thiết bị kênh nào đấy của thiết bị',
            icon: Power,
            color: '#4CAF50',
            screen: 'DeviceToggleAction'
          }
        ]
    }
  ];

  // Lọc action dựa trên từ khóa tìm kiếm
  const filteredCategories = searchQuery.trim() === '' ? 
    actionCategories : 
    actionCategories.map(category => ({
      ...category,
      actions: category.actions.filter(action => 
        action.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(category => category.actions.length > 0);

  // Xử lý khi chọn một action
  const handleActionSelect = (action) => {
    navigation.navigate(action.screen);
  };

  // Render mỗi danh mục action
  const renderCategory = ({ item }) => (
    <View className="mb-6">
      <View className="flex-row items-center mb-2">
        <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: `${item.color}20` }}>
          <item.icon size={16} color={item.color} />
        </View>
        <Text className="text-lg font-bold ml-2">{item.title}</Text>
      </View>
      
      {item.actions.map(action => (
        <TouchableOpacity
          key={action.id}
          onPress={() => handleActionSelect(action)}
          className="flex-row items-center p-4 bg-white rounded-lg mb-2 shadow-sm"
        >
          <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: `${action.color}20` }}>
            <action.icon size={20} color={action.color} />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-base font-medium">{action.label}</Text>
            <Text className="text-sm text-gray-500">{action.description}</Text>
          </View>
          <ChevronRight size={20} color="#CCCCCC" />
        </TouchableOpacity>
      ))}
    </View>
  );

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
        <Text className="text-xl font-semibold">Chọn hành động</Text>
      </View>
      
      <View className="p-4">
        <TextInput
          className="bg-white p-3 rounded-lg border border-gray-200 mb-4"
          placeholder="Tìm kiếm hành động..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <FlatList
          data={filteredCategories}
          renderItem={renderCategory}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center p-8">
              <Text className="text-gray-500 text-center">Không tìm thấy hành động nào</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ActionList;