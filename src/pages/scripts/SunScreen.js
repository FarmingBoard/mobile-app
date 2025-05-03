import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { useScript } from '../../contexts/ScriptContext';

const TemperatureScreen = () => {
  const navigation = useNavigation();
  const { triggers, setTriggers } = useScript();
  const [temperature, setTemperature] = useState(0);
  const [comparison, setComparison] = useState('equal'); // 'below', 'equal', 'above'

  // Handle temperature change from slider
  const handleTemperatureChange = (value) => {
    setTemperature(Math.round(value));
  };

  // Set comparison type
  const handleComparisonChange = (type) => {
    setComparison(type);
  };

  // Handle continue button press
  const handleContinue = () => {
    // Add temperature trigger to context
    const temperatureTrigger = {
      type: 'temperature',
      value: temperature,
      comparison: comparison
    };
    
    // Update triggers in context
    setTriggers([...triggers, temperatureTrigger]);
    
    // Navigate back to the create script screen
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nhiệt độ</Text>
        <TouchableOpacity onPress={handleContinue} style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Tiếp theo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.comparisonContainer}>
        <TouchableOpacity 
          style={[styles.comparisonButton, comparison === 'below' && styles.activeComparisonButton]}
          onPress={() => handleComparisonChange('below')}
        >
          <Text style={styles.comparisonButtonText}>Phía dưới</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.comparisonButton, comparison === 'equal' && styles.activeComparisonButton]}
          onPress={() => handleComparisonChange('equal')}
        >
          <Text style={styles.comparisonButtonText}>Bằng nhau</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.comparisonButton, comparison === 'above' && styles.activeComparisonButton]}
          onPress={() => handleComparisonChange('above')}
        >
          <Text style={styles.comparisonButtonText}>Bên trên</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.temperatureContainer}>
        <Text style={styles.temperatureValue}>{temperature}°C</Text>
        
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={-40}
            maximumValue={40}
            value={temperature}
            onValueChange={handleTemperatureChange}
            minimumTrackTintColor="#4CAF50"
            maximumTrackTintColor="#E0E0E0"
            thumbTintColor="#4CAF50"
            step={1}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>-40°C</Text>
            <Text style={styles.sliderLabel}>40°C</Text>
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

export default TemperatureScreen;