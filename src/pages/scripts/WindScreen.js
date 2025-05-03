import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { useScript } from '../../contexts/ScriptContext';
import { useRoute } from '@react-navigation/native';

const WindScreen = () => {
  const navigation = useNavigation();
  const { triggers, setTriggers } = useScript();
  const route = useRoute();
  const [temperature, setTemperature] = useState(0);
  const [comparison, setComparison] = useState('='); // 'below', 'equal', 'above'

  // Handle temperature change from slider
  const handleTemperatureChange = (value) => {
    setTemperature(Math.round(value));
  };

  // Set comparison type
  const handleComparisonChange = (type) => {
    setComparison(type);
  };

  useEffect(() => {
    // Set initial temperature and comparison based on route params if available
    if (route.params) {
      const { triggerIndex, condIndex } = route.params;
      const trigger = triggers[triggerIndex];
      const condition = trigger.conditions[condIndex];
      setTemperature(condition.value);
      setComparison(condition.operator);
    }
  }, []);

  // Handle continue button press
  const handleContinue = () => {
    // Add temperature trigger to context
    const temperatureTrigger = {
      key: 'wind_speed',
      value: temperature,
      operator: comparison
    };
    
    setTriggers(prev => {
        if(route.params) {
          const { triggerIndex, condIndex } = route.params;
          let newTriggers = [...prev];
          newTriggers[triggerIndex].conditions[condIndex] = temperatureTrigger;
          return newTriggers;
        }
        if(prev == undefined) {
            prev = [];
        }
        let index = prev.findIndex(item => item.type == 'WEATHER');
        if (index === -1) {
            prev.push({
                type: "WEATHER",
                conditions: [temperatureTrigger]
            });
            return prev;
        } else {
            let newTriggers = [...prev];
            newTriggers[index].conditions.push(temperatureTrigger);
            return newTriggers;
        }
    })
    
    
    // Navigate back to the create script screen
    navigation.navigate('Điều kiện');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tốc độ gió</Text>
        <TouchableOpacity onPress={handleContinue} style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Tiếp theo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.comparisonContainer}>
        <TouchableOpacity 
          style={[styles.comparisonButton, comparison === '<' && styles.activeComparisonButton]}
          onPress={() => handleComparisonChange('<')}
        >
          <Text style={styles.comparisonButtonText}>Phía dưới</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.comparisonButton, comparison === '=' && styles.activeComparisonButton]}
          onPress={() => handleComparisonChange('=')}
        >
          <Text style={styles.comparisonButtonText}>Bằng nhau</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.comparisonButton, comparison === '>' && styles.activeComparisonButton]}
          onPress={() => handleComparisonChange('>')}
        >
          <Text style={styles.comparisonButtonText}>Bên trên</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.temperatureContainer}>
        <Text style={styles.temperatureValue}>{temperature}m/s</Text>
        
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={62}
            value={temperature}
            onValueChange={handleTemperatureChange}
            minimumTrackTintColor="#4CAF50"
            maximumTrackTintColor="#E0E0E0"
            thumbTintColor="#4CAF50"
            step={1}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>0m/s</Text>
            <Text style={styles.sliderLabel}>62m/s</Text>
          </View>
        </View>
      </View>
    </View>
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
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
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
  comparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 24,
  },
  comparisonButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeComparisonButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  comparisonButtonText: {
    textAlign: 'center',
    fontWeight: '500',
  },
  temperatureContainer: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 24,
  },
  temperatureValue: {
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
    width: '100%',
    paddingHorizontal: 10,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#757575',
  },
});

export default WindScreen;