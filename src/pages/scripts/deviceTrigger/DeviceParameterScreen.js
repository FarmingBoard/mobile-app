import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { useScript } from '../../../contexts/ScriptContext';
import { ArrowLeft } from 'lucide-react-native';

const DeviceParameterScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { device, parameter } = route.params;
  const { triggers, setTriggers } = useScript();
  
  const [value, setValue] = useState(0);
  const [comparison, setComparison] = useState('='); // '<', '=', '>'
  
  // Cấu hình thông số dựa vào loại tham số
  const parameterConfig = {
    temp: {
      title: 'Nhiệt độ',
      unit: '°C',
      min: -40,
      max: 60,
      defaultValue: 25,
      icon: 'Thermometer',
      color: '#FF9800'
    },
    humidity: {
      title: 'Độ ẩm không khí',
      unit: '%',
      min: 0,
      max: 100,
      defaultValue: 50,
      icon: 'Droplet',
      color: '#2196F3'
    },
    soilMoisture: {
      title: 'Độ ẩm đất',
      unit: '%',
      min: 0,
      max: 100,
      defaultValue: 30,
      icon: 'Droplet',
      color: '#4CAF50'
    },
    light: {
      title: 'Ánh sáng',
      unit: 'lux',
      min: 0,
      max: 10000,
      defaultValue: 500,
      icon: 'Sun',
      color: '#FFC107'
    },
    rain: {
      title: 'Lượng mưa',
      unit: 'mm',
      min: 0,
      max: 100,
      defaultValue: 5,
      icon: 'Cloud',
      color: '#607D8B'
    }
  };

  // Lấy cấu hình cho tham số hiện tại
  const config = parameterConfig[parameter.id] || {
    title: parameter.label,
    unit: '',
    min: 0,
    max: 100,
    defaultValue: 50,
    icon: 'Cpu',
    color: '#9C27B0'
  };

  useEffect(() => {
    // Khởi tạo giá trị mặc định
    setValue(config.defaultValue);
  }, [parameter]);

  // Xử lý thay đổi giá trị từ slider
  const handleValueChange = (newValue) => {
    setValue(Math.round(newValue));
  };

  // Đặt loại so sánh
  const handleComparisonChange = (type) => {
    setComparison(type);
  };

  // Xử lý nút tiếp tục
  const handleContinue = () => {
    // Tạo trigger với thông số đã chọn
    const trigger = {
      type: 'device',
      device: device,
      parameter: parameter.id,
      value: value,
      operator: comparison,
      label: `${device.name} - ${parameter.label} ${getOperatorSymbol(comparison)} ${value}${config.unit}`
    };
    
    // Thêm trigger vào context
    /*
     "trigger": [
    {
      "type": "SCHEDULE",
      "conditions": [
        {
          "time": "20:48",
          "utcOffset": 7,
          "days": [
            2,
            3
          ]
        }
      ]
    },
    {
      "type": "WEATHER",
      "conditions": [
        {
          "key": "temperature",
          "operator": ">",
          "value": 20
        },
        {
          "key": "humidity",
          "operator": "<",
          "value": 80
        }
      ]
    },
    {
      "type": "DEVICE",
      "conditions": [
        {
          "deviceName": "MB",
          "conditions": [
            {
              "key":"soilMoisture",
              "operator": "<",
              "value": 30
            }
          ]
        }
      ]
    }
  ],
    */
   setTriggers(prev => {
    if(prev == null) {
      prev = [];
    }
    let index = prev.findIndex(item => item.type == 'DEVICE');
    if (index === -1) {
      prev.push({
        type: 'DEVICE',
        conditions: [{
          deviceName: device.name,
          conditions: [{
            key: parameter.id,
            operator: comparison,
            value: value
          }]
        }]
      });
      return prev;
    } else {
      let newTriggers = [...prev];
      let indexDevice = newTriggers[index].conditions.findIndex(item => item.deviceName == device.name);
      if (indexDevice === -1) {
        newTriggers[index].conditions.push({
          deviceName: device.name,
          conditions: [{
            key: parameter.id,
            operator: comparison,
            value: value
          }]
        });
      } else {
        let newConditions = [...newTriggers[index].conditions[indexDevice].conditions];
        let indexCondition = newConditions.findIndex(item => item.key == parameter.id);
        if (indexCondition === -1) {
          newConditions.push({
            key: parameter.id,
            operator: comparison,
            value: value
          });
        } else {
          newConditions[indexCondition].operator = comparison;
          newConditions[indexCondition].value = value;
        } 
        newConditions[indexDevice].conditions = newConditions;
        newTriggers[index].conditions[indexDevice].conditions = newConditions;
      }
      return newTriggers;
    }
   })
    
    // Quay lại trang tạo kịch bản
    navigation.navigate('Điều kiện');
  };

  // Chuyển đổi toán tử so sánh sang ký hiệu
  const getOperatorSymbol = (op) => {
    switch(op) {
      case '<': return 'nhỏ hơn';
      case '=': return 'bằng';
      case '>': return 'lớn hơn';
      default: return op;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{config.title}</Text>
        <TouchableOpacity onPress={handleContinue} style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Tiếp theo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.deviceInfoContainer}>
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName}>{device.name}</Text>
          <Text style={styles.deviceType}>{device.type}</Text>
        </View>
      </View>

      <View style={styles.comparisonContainer}>
        <TouchableOpacity 
          style={[styles.comparisonButton, comparison === '<' && styles.activeComparisonButton]}
          onPress={() => handleComparisonChange('<')}
        >
          <Text style={[
            styles.comparisonButtonText, 
            comparison === '<' && styles.activeComparisonButtonText
          ]}>Nhỏ hơn</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.comparisonButton, comparison === '=' && styles.activeComparisonButton]}
          onPress={() => handleComparisonChange('=')}
        >
          <Text style={[
            styles.comparisonButtonText, 
            comparison === '=' && styles.activeComparisonButtonText
          ]}>Bằng</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.comparisonButton, comparison === '>' && styles.activeComparisonButton]}
          onPress={() => handleComparisonChange('>')}
        >
          <Text style={[
            styles.comparisonButtonText, 
            comparison === '>' && styles.activeComparisonButtonText
          ]}>Lớn hơn</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.valueContainer}>
        <Text style={[styles.valueText, {color: config.color}]}>
          {value}{config.unit}
        </Text>
        
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={config.min}
            maximumValue={config.max}
            value={value}
            onValueChange={handleValueChange}
            minimumTrackTintColor={config.color}
            maximumTrackTintColor="#E0E0E0"
            thumbTintColor={config.color}
            step={1}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>{config.min}{config.unit}</Text>
            <Text style={styles.sliderLabel}>{config.max}{config.unit}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  continueButton: {
    padding: 8,
  },
  continueButtonText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  deviceInfoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceType: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  comparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 24,
  },
  comparisonButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  activeComparisonButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  comparisonButtonText: {
    textAlign: 'center',
    fontWeight: '500',
    color: '#757575',
  },
  activeComparisonButtonText: {
    color: '#FFFFFF',
  },
  valueContainer: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 24,
  },
  valueText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  sliderContainer: {
    width: '100%',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#757575',
  },
});

export default DeviceParameterScreen;
