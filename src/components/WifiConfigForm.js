import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const WifiConfigForm = ({ wifiSSID, wifiPassword, onSSIDChange, onPasswordChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Cấu hình WiFi:</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên WiFi (SSID)"
        value={wifiSSID}
        onChangeText={onSSIDChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu WiFi"
        value={wifiPassword}
        onChangeText={onPasswordChange}
        secureTextEntry
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
});

export default WifiConfigForm;
