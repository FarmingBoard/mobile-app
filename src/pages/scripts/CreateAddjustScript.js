import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { ChevronRight, Plus, Fingerprint } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const CreateSceneScreen = () => {
    const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f6fa' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f6fa" />
      
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <TouchableOpacity
            onPress={() => navigation.goBack()}
        >
          <Text style={{ color: '#666', fontSize: 16 }}>Hủy bỏ</Text>
        </TouchableOpacity>
        <Text style={{ 
          fontSize: 24, 
          fontWeight: 'bold', 
          color: '#333',
          marginTop: 16,
          marginBottom: 16
        }}>
          Tạo cảnh
        </Text>
      </View>
      
      <ScrollView style={{ flex: 1 }}>
        {/* If Section */}
        <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12
          }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#333' }}>Nếu</Text>
            <TouchableOpacity style={{ 
              width: 28, 
              height: 28, 
              borderRadius: 14, 
              backgroundColor: '#4CD964',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Plus size={18} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* Condition Item */}
          <TouchableOpacity style={{ 
            flexDirection: 'row', 
            alignItems: 'center',
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 8,
            marginBottom: 8
          }}>
            <View style={{ 
              width: 32, 
              height: 32, 
              borderRadius: 16, 
              backgroundColor: 'rgba(255, 149, 112, 0.2)',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12
            }}>
              <Fingerprint size={18} color="#FF9570" />
            </View>
            <Text style={{ fontSize: 16, color: '#333' }}>Chạm để Chạy</Text>
          </TouchableOpacity>
        </View>
        
        {/* Then Section */}
        <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12
          }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#333' }}>Thực hiện</Text>
            <TouchableOpacity style={{ 
              width: 28, 
              height: 28, 
              borderRadius: 14, 
              backgroundColor: '#4CD964',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Plus size={18} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* Action Placeholder */}
          <View style={{ 
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 8
          }}>
            <Text style={{ fontSize: 16, color: '#999' }}>Thêm hành động thực thi</Text>
          </View>
        </View>
        
        {/* Display Settings */}
        <TouchableOpacity style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: 16,
          marginHorizontal: 16,
          borderRadius: 8
        }}>
          <Text style={{ fontSize: 16, color: '#333' }}>Cài đặt hiển thị</Text>
          <ChevronRight size={20} color="#CCCCCC" />
        </TouchableOpacity>
      </ScrollView>
      
      {/* Save Button */}
      <View style={{ padding: 16 }}>
        <TouchableOpacity style={{ 
          backgroundColor: '#4CD964', 
          paddingVertical: 14, 
          borderRadius: 8,
          alignItems: 'center'
        }}>
          <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateSceneScreen;