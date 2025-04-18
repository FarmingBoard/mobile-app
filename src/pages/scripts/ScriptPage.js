import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Link2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const AutomationEmptyState = () => {
    const navigation = useNavigation();
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f5f6fa" />
      <View className="bg-white pt-4 pb-4 px-5 shadow-sm">
          <View className="flex-row items-center">
            <Text className="text-xl font-bold text-gray-800">Kịch bản</Text>
          </View>
      </View>
      {/* Tab Navigation */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12 }}>
        <TouchableOpacity 
          style={{ 
            paddingVertical: 8, 
            paddingHorizontal: 12, 
            borderBottomWidth: 2, 
            borderBottomColor: '#333333' 
          }}
        >
          <Text style={{ fontWeight: '600', color: '#333333', fontSize: 16 }}>Tự động</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ 
            paddingVertical: 8, 
            paddingHorizontal: 12, 
            borderBottomWidth: 0,
            marginLeft: 16
          }}
        >
          <Text style={{ fontWeight: '400', color: '#888888', fontSize: 16 }}>Chạm để Chạy</Text>
        </TouchableOpacity>
      </View>
      
      {/* Empty State Content */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
        {/* Circle with Icon */}
        <View style={{ 
          width: 80, 
          height: 80, 
          borderRadius: 40, 
          backgroundColor: '#e0e0e0', 
          justifyContent: 'center', 
          alignItems: 'center',
          marginBottom: 24
        }}>
          <Link2 size={32} color="#a0a0a0" />
        </View>
        
        {/* Description Text */}
        <Text style={{ 
          textAlign: 'center', 
          color: '#888888', 
          fontSize: 15, 
          lineHeight: 22,
          marginBottom: 40
        }}>
          Thực thi tự động theo các điều kiện như thời tiết, trạng thái của thiết bị và thời gian
        </Text>
        
        {/* Create Button */}
        <TouchableOpacity 
          style={{ 
            backgroundColor: '#4CD964', 
            paddingVertical: 14, 
            paddingHorizontal: 24, 
            borderRadius: 8,
            width: '100%',
            alignItems: 'center'
          }}
           onPress={() => navigation.navigate('Tạo kịch bản')}
        >
          <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Tạo kịch bản</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AutomationEmptyState;