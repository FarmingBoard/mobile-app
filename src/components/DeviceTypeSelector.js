import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Cpu } from 'lucide-react-native';

const deviceTypes = [
  { id: 'sensor', name: 'Tổ hợp 1', icon: <Cpu size={24} color="#555" /> }
];

const DeviceTypeSelector = ({ selectedType, onSelectType }) => {
  return (
    <View style={styles.typeContainer}>
      <Text style={styles.label}>Loại thiết bị:</Text>
      <View style={styles.typeButtonsContainer}>
        {deviceTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeButton,
              selectedType?.id === type.id && styles.selectedType,
            ]}
            onPress={() => onSelectType(type)}
          >
            {type.icon}
            <Text style={styles.typeText}>{type.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  typeContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  typeButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    gap: 8,
  },
  selectedType: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  typeText: {
    fontSize: 16,
    color: '#333',
  },
});

export default DeviceTypeSelector;
