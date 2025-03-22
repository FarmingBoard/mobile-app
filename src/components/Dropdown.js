import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

const Dropdown = ({ label, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const animatedController = useRef(new Animated.Value(0)).current;
  const bodySectionHeight = useRef(new Animated.Value(0)).current;

  const bodyHeight = options.length * 50; // Assuming each option is 50px high

  const toggleListItem = () => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(animatedController, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(bodySectionHeight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => setIsOpen(false));
    } else {
      setIsOpen(true);
      Animated.parallel([
        Animated.timing(animatedController, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(bodySectionHeight, {
          toValue: bodyHeight,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const selectOption = (option) => {
    setSelectedOption(option);
    onSelect(option);
    toggleListItem();
  };

  const rotateZ = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleListItem} style={styles.header}>
        <Text style={styles.headerText}>
          {selectedOption ? selectedOption.label : label}
        </Text>
        <Animated.View style={{ transform: [{ rotateZ }] }}>
          {isOpen ? <ChevronUp size={24} color="#333" /> : <ChevronDown size={24} color="#333" />}
        </Animated.View>
      </TouchableOpacity>
      <Animated.View style={[styles.bodyBackground, { height: bodySectionHeight }]}>
        <ScrollView style={styles.body} nestedScrollEnabled={true}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => selectOption(option)}
              style={styles.option}
            >
              <Text style={[
                styles.optionText,
                selectedOption && selectedOption.value === option.value && styles.selectedOption
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginVertical: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  headerText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  bodyBackground: {
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  body: {
    paddingHorizontal: 10,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  optionText: {
    fontSize: 14,
    color: '#495057',
  },
  selectedOption: {
    fontWeight: 'bold',
    color: '#228be6',
  },
});

export default Dropdown;