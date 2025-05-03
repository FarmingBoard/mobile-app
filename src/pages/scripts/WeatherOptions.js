import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { ArrowLeft, Sun, Thermometer, Droplet, Wind, Cloud, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useScript } from '../../contexts/ScriptContext';

const WeatherOptions = () => {
  const navigation = useNavigation();
  const { setTriggers } = useScript();
  const [selectedOption, setSelectedOption] = useState(null);

  const weatherOptions = [
    {
      id: 1,
      title: 'Nhiệt độ',
      description: 'Khi nhiệt độ đạt đến một giá trị nhất định',
      icon: (props) => <Thermometer {...props} />,
      color: '#FF8A65',
      to: 'Nhiệt độ'
    },
    {
      id: 2,
      title: 'Độ ẩm',
      description: 'Khi độ ẩm không khí đạt đến một giá trị nhất định',
      icon: (props) => <Droplet {...props} />,
      color: '#64B5F6',
      to: 'Độ ẩm'
    },
    {
      id: 3,
      title: 'Gió',
      description: 'Khi tốc độ gió đạt đến một giá trị nhất định',
      icon: (props) => <Wind {...props} />,
      color: '#81C784',
      to: 'Gió'
    },
    {
        id: 4,
        title: 'Thời thiết',
        description: 'Khi thời tiết thay đổi',
        icon: (props) => <Cloud {...props} />,
        color: '#FFD54F',
        to: 'Trạng thái thời tiết'
    },
    {
        id: 5,
        title: 'Mặt trời',
        description: 'Khoảng thời gian so với bình minh, hoàng hơn',
        icon: (props) => <Sun {...props} />,
        color: '#FFD54F',
        to: 'Mặt trời'
    }
  ];

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    navigation.navigate(option.to);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold">Điều kiện thời tiết</Text>
      </View>
      
      <ScrollView className="flex-1 p-4">
        <Text className="text-base text-gray-600 mb-4">
          Chọn điều kiện thời tiết để kích hoạt kịch bản của bạn
        </Text>
        
        {weatherOptions.map((option) => (
          <TouchableOpacity 
            key={option.id}
            onPress={() => handleOptionSelect(option)}
            className="flex-row items-center bg-white p-4 rounded-lg mb-3 border border-gray-100"
          >
            <View style={{ backgroundColor: option.color + '20', padding: 10, borderRadius: 12 }}>
              {option.icon({ size: 24, color: option.color })}
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-lg font-medium">{option.title}</Text>
              <Text className="text-sm text-gray-500 mt-1">{option.description}</Text>
            </View>
            <ChevronRight size={20} color="#CCCCCC" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default WeatherOptions;
