import React from 'react';
import { useScript } from '../../contexts/ScriptContext';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { ArrowLeft, ChevronRight, Sun, Clock, Zap, Fingerprint } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const SceneCreationScreen = () => {
  const navigation = useNavigation();
  const sceneOptions = [
    {
      id: 1,
      title: 'Chạm để Chạy',
      description: 'Ví dụ: tắt tất cả đèn trong phòng ngủ bằng một lần chạm.',
      icon: (props) => <Fingerprint {...props} />,
      color: '#FF8A65',
      to: 'Điều kiện',
    },
    {
      id: 2,
      title: 'Khi thời tiết thay đổi',
      description: 'Ví dụ: khi nhiệt độ lớn hơn 28°C.',
      icon: (props) => <Sun {...props} />,
      color: '#FFB74D',
      to: 'Thời tiết',
    },
    {
      id: 3,
      title: 'Lịch',
      description: 'Ví dụ: 7:00 mỗi sáng.',
      icon: (props) => <Clock {...props} />,
      color: '#64B5F6',
      to: 'Lên lịch',
    },
    {
      id: 4,
      title: 'Khi trạng thái thiết bị thay đổi',
      description: 'Ví dụ: khi một hoạt động bất thường được phát hiện.',
      icon: (props) => <Zap {...props} />,
      color: '#4DB6AC',
      to: 'Trạng thái thiết bị',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {/* Scene Options */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
        {sceneOptions.map((option) => (
          <TouchableOpacity 
            key={option.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 1,
              elevation: 1,
              borderWidth: 1,
              borderColor: '#f3f4f6'
            }}
            onPress={() => {
              navigation.navigate(option.to);
            }}
          >
            <View 
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
                backgroundColor: `${option.color}20` // Light version of the color
              }}
            >
              {option?.icon({ size: 20, color: option.color })}
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '500', color: '#1f2937' }}>
                {option.title}
              </Text>
              <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
                {option.description}
              </Text>
            </View>
            
            <ChevronRight size={20} color="#CCCCCC" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SceneCreationScreen;