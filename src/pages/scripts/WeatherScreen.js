import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useScript } from '../../contexts/ScriptContext';
import { useRoute } from '@react-navigation/native';

const WeatherScreen = () => {
  const navigation = useNavigation();
  const { triggers, setTriggers } = useScript();
  const route = useRoute();

  const weatherOptions = [
    { label: 'Nắng', value: 'Clear' },
    { label: 'Nhiều mây', value: 'Clouds' },
    { label: 'Mưa', value: 'Rain' },
    { label: 'Tuyết rơi', value: 'Snow' },
    { label: 'Sương mù', value: 'Fog' },
    { label: 'Giông bão', value: 'Thunderstorm' },
    { label: 'Mưa phùn', value: 'Drizzle' },
    { label: 'Sương mù nhẹ', value: 'Mist' },
    { label: 'Khói mù', value: 'Haze' },
  ];
  

  const handleWeatherSelect = (weatherValue) => {
    const weatherTrigger = {
      key: 'weather',
      value: weatherValue,
      operator: '='
    };

    setTriggers(prev => {
      if(route.params) {
        const { triggerIndex, condIndex } = route.params;
        let newTriggers = [...prev];
        newTriggers[triggerIndex].conditions[condIndex] = weatherTrigger;
        return newTriggers;
      }
      if(prev == undefined) {   
        prev = [];
      }
      let index = prev.findIndex(item => item.type == 'WEATHER');
      if (index === -1) {
        prev.push({
          type: 'WEATHER',
          conditions: [weatherTrigger]
        });
        return prev;
      } else {
        let newTriggers = [...prev];
        newTriggers[index].conditions.push(weatherTrigger);
        return newTriggers;
      }
    });

    navigation.navigate('Điều kiện');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thời tiết</Text>
        <View style={styles.backButton}>
          <Text> </Text>
        </View>
      </View>

      <ScrollView style={styles.optionsContainer}>
        {weatherOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handleWeatherSelect(option.value)}
          >
            <Text style={styles.optionText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    width: 50,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
  },
});

export default WeatherScreen;