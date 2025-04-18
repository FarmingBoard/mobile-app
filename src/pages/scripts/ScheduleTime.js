import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const ScheduleTimeScreen = () => {
    const navigation = useNavigation();
  // State for selected hour and minute
  const [selectedHour, setSelectedHour] = useState(23);
  const [selectedMinute, setSelectedMinute] = useState(21);
  
  // Generate hours and minutes for the picker
  const hours = [22, 23, 0];
  const minutes = [20, 21, 22];
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 16, 
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
      }}>
        <TouchableOpacity onPress={() => {
            navigation.goBack();
        }}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={{ 
          flex: 1, 
          textAlign: 'center', 
          fontSize: 18, 
          fontWeight: '500' 
        }}>Lịch</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Điều kiện');
            }}
        >
          <Text style={{ color: '#4CD964', fontSize: 16, fontWeight: '500' }}>Tiếp theo</Text>
        </TouchableOpacity>
      </View>
      
      {/* Repeat Option */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: 'white'
      }}>
        <Text style={{ fontSize: 16, color: '#333' }}>Lặp lại</Text>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#999', marginRight: 8 }}>Chỉ một</Text>
          <ChevronRight size={20} color="#CCCCCC" />
        </TouchableOpacity>
      </View>
      
      {/* Time Picker Section */}
      <View style={{ 
        flex: 1, 
        backgroundColor: '#f5f6fa', 
        paddingTop: 24
      }}>
        <Text style={{ 
          fontSize: 16, 
          color: '#666', 
          marginLeft: 16, 
          marginBottom: 24 
        }}>
          Đặt thời gian bắt đầu
        </Text>
        
        {/* Time Picker */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'center', 
          alignItems: 'center',
          paddingHorizontal: 40
        }}>
          {/* Hours Column */}
          <View style={{ width: 80, alignItems: 'center' }}>
            {hours.map((hour, index) => (
              <TouchableOpacity 
                key={`hour-${index}`}
                onPress={() => setSelectedHour(hour)}
                style={{ 
                  paddingVertical: 12,
                  width: '100%',
                  alignItems: 'center'
                }}
              >
                <Text style={{ 
                  fontSize: hour === selectedHour ? 24 : 20, 
                  color: hour === selectedHour ? '#333' : '#999',
                  fontWeight: hour === selectedHour ? '500' : '400'
                }}>
                  {hour.toString().padStart(2, '0')}
                </Text>
                {hour === selectedHour && (
                  <View style={{ 
                    height: 2, 
                    backgroundColor: '#4CD964', 
                    width: '80%', 
                    marginTop: 4 
                  }} />
                )}
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Colon */}
          <Text style={{ fontSize: 24, marginHorizontal: 16, marginBottom: 8 }}>:</Text>
          
          {/* Minutes Column */}
          <View style={{ width: 80, alignItems: 'center' }}>
            {minutes.map((minute, index) => (
              <TouchableOpacity 
                key={`minute-${index}`}
                onPress={() => setSelectedMinute(minute)}
                style={{ 
                  paddingVertical: 12,
                  width: '100%',
                  alignItems: 'center'
                }}
              >
                <Text style={{ 
                  fontSize: minute === selectedMinute ? 24 : 20, 
                  color: minute === selectedMinute ? '#333' : '#999',
                  fontWeight: minute === selectedMinute ? '500' : '400'
                }}>
                  {minute.toString().padStart(2, '0')}
                </Text>
                {minute === selectedMinute && (
                  <View style={{ 
                    height: 2, 
                    backgroundColor: '#4CD964', 
                    width: '80%', 
                    marginTop: 4 
                  }} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ScheduleTimeScreen;