import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  FlatList, 
  Modal,
  PermissionsAndroid,
} from 'react-native';
import { Plus, Cpu, PlusCircle, Bluetooth, X } from 'lucide-react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import useCreateDevice from '../hooks/useCreateDevice';
import { useNavigation } from '@react-navigation/native';
import { Buffer } from 'buffer';
import useGetAccessToken from '../hooks/useGetAccessToken';
import { mqttPort, mqttServer } from '../utils/ApiPath';
import useGetAssets from '../hooks/useGetAssets';
import useCreateDeviceAssetRelation from '../hooks/useCreateDeviceAssetRelation';
import deviceType from '../types/DeviceType';
import { setAttributeShareScope } from '../api/setAttributeShareScope';
import DeviceSetupScreen from './DeviceScanner';
import { set } from 'date-fns';

// UUID cho dịch vụ tùy
const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
// UUID cho đặc trưng tùy chỉnh
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

// Device type options
const deviceTypes = Array.from(deviceType).map(([key, value]) => {
  return {
    id: key,
    name: key,
    icon: <Cpu size={24} color="#555" />,
  }
})

const AddDeviceScreen = () => {
  const navigation = useNavigation();
  const [deviceName, setDeviceName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { createDevice, loading, error } = useCreateDevice();
  const [currentDevice, setCurrentDevice] = useState(null);
  const [bleManager, setBleManager] = useState(null);
  const { getAccessToken } = useGetAccessToken();
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const { assets } = useGetAssets("Vườn"); 
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const { createDeviceAssetRelation } = useCreateDeviceAssetRelation();
  const [creating, setCreating] = useState(false);

  const SelectAssetModal = () => {
    return (
      <Modal
        visible={selectModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectModalVisible(false)}
      >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Chọn khung cảnh</Text>
                <TouchableOpacity 
                  onPress={() => {
                    setSelectModalVisible(false);
                  }}
                >
                  <X size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <FlatList
              className='h-[200px]'
                  data={assets}
                  keyExtractor={(item) => item.id.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.assetButton}
                      onPress={() => {
                        setSelectedAsset(item);
                        setSelectModalVisible(false);
                      }}
                    >
                      <Text className='p-3 text-green-700 text-md border border-gray-300 border-1 rounded m-1'>{item.name}</Text>
                    </TouchableOpacity>
                  )
                }
                />
          </View>
        </View>
      </Modal>
    );
  };

  // Effect để khởi tạo BleManager
  useEffect(() => {
    // Khởi tạo BleManager mới khi vào màn hình
    const manager = new BleManager();
    setBleManager(manager);

    // Request permissions when component mounts
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        const granted = await requestAndroidPermissions();
        if (!granted) {
          Alert.alert('Quyền truy cập', 'Cần quyền truy cập Bluetooth để quét thiết bị');
        }
      }
    };

    requestPermissions();

    // Clean up BLE manager when component unmounts
    return () => {
      if (isScanning) {
        manager.stopDeviceScan();
      }
      manager.destroy();
    };
  }, []); // Chỉ chạy một lần khi mount

  // Request Android permissions for BLE
  const requestAndroidPermissions = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          // For Android 12+
          ...(Platform.Version >= 31 
            ? [
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
              ] 
            : [])
        ]);
        
        if (
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED &&
          (Platform.Version < 31 || 
            (granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
             granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED))
        ) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  // Start scanning for BLE devices
  const startScan = () => {
    if (!bleManager) {
      Alert.alert('Lỗi', 'Bluetooth chưa sẵn sàng, vui lòng thử lại');
      return;
    }

    setDevices([]);
    setIsScanning(true);
    setModalVisible(true);

    // Keep track of discovered devices to avoid duplicates
    const discoveredDevices = new Map();

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Lỗi quét thiết bị:', error);
        stopScan();
        Alert.alert('Lỗi', 'Không thể quét thiết bị Bluetooth. Vui lòng thử lại.');
        return;
      }

      // Only add devices with a name (to filter out unknown devices)
      if (device && device.name && !discoveredDevices.has(device.id)) {
        discoveredDevices.set(device.id, device);
        setDevices(Array.from(discoveredDevices.values()));
      }
    });

    // Stop scan after 10 seconds
    setTimeout(() => {
      stopScan();
    }, 10000);
  };

  // Stop scanning for BLE devices
  const stopScan = () => {
    if (bleManager) {
      bleManager.stopDeviceScan();
      setIsScanning(false);
    }
  };

  // Connect to a selected device
  const connectToDevice = async (device) => {
    if (!bleManager) {
      Alert.alert('Lỗi', 'Bluetooth chưa sẵn sàng, vui lòng thử lại');
      return;
    }

    try {

      setDeviceId(device.id);
      console.log('Đang kết nối với thiết bị:', device.name);
      
      // Kết nối với thiết bị
      const connectedDevice = await device.connect();
      console.log('Đã kết nối với thiết bị');

      // Khám phá các services
      const discoveredDevice = await connectedDevice.discoverAllServicesAndCharacteristics();
      console.log('Đã khám phá services và characteristics');

      // Kiểm tra xem thiết bị có service và characteristic cần thiết không
      const services = await discoveredDevice.services();
      let hasRequiredService = false;
      
      for (const service of services) {
        if (service.uuid === SERVICE_UUID) {
          hasRequiredService = true;
          console.log('Tìm thấy service phù hợp');
          break;
        }
      }

      if (!hasRequiredService) {
        Alert.alert('Lỗi', 'Thiết bị không hỗ trợ service cần thiết');
        await device.cancelConnection();
        return;
      }

      setCurrentDevice(device);
      Alert.alert('Tìm thấy', 'Đã kết nối với thiết bị ' + device.name);
      setModalVisible(false);
      stopScan();

    } catch (error) {
      console.error('Lỗi kết nối:', error);
      Alert.alert('Lỗi', 'Không thể kết nối với thiết bị. Vui lòng thử lại.');
    }
  };

  const sendMessageToDevice = async (device, message) => {
    if (!bleManager) {
      Alert.alert('Lỗi', 'Bluetooth chưa sẵn sàng, vui lòng thử lại');
      return false;
    }

    try {
      // Kiểm tra và kết nối lại nếu cần
      let connectedDevice = device;
      if (!device.isConnected()) {
        connectedDevice = await device.connect();
        await connectedDevice.discoverAllServicesAndCharacteristics();
      }
  
      console.log('Sending message:', message);
      const encodedMessage = Buffer.from(message).toString('base64');
      console.log('Encoded message:', encodedMessage);

      // Gửi tin nhắn đã mã hóa base64
      await connectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        encodedMessage
      );
  
      console.log('Message sent successfully');
      return true;
    } catch (error) {
      console.error('Lỗi gửi tin nhắn:', error);
      Alert.alert('Lỗi', 'Không thể gửi tin nhắn đến thiết bị');
      return false;
    }
  };

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  const handleAddDevice = async () => {
    setCreating(true);

    let devicesX = []

    if (!bleManager) {
      Alert.alert('Lỗi', 'Bluetooth chưa sẵn sàng, vui lòng thử lại');
      return;
    }

    setDevices([]);
    setIsScanning(true);
    setModalVisible(true);

    // Keep track of discovered devices to avoid duplicates
    const discoveredDevices = new Map();

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Lỗi quét thiết bị:', error);
        stopScan();
        Alert.alert('Lỗi', 'Không thể quét thiết bị Bluetooth. Vui lòng thử lại.');
        return;
      }

      // Only add devices with a name (to filter out unknown devices)
      if (device && device.name && !discoveredDevices.has(device.id)) {
        discoveredDevices.set(device.id, device);
        devicesX = Array.from(discoveredDevices.values());
        setDevices(Array.from(discoveredDevices.values()));
      }
    });

    setTimeout(() => {
      stopScan();
    }
    , 10000);


    // tôi muốn nó dừng thực thi chương trình phía sau 10s
    await sleep(10000);

    // liet ke cac thiet bi bluetooth
    console.log('Devices:', devicesX);

    // ket noi den thiet bi bluetooth ten la ESP32_BLE
    const deviceESP = devicesX.find(device => device.name == 'ESP32_BLE');
    if (!deviceESP) {
      Alert.alert('Lỗi', 'Không tìm thấy thiết bị nào');
    }
    setCurrentDevice(deviceESP);
    setDeviceId(deviceESP.id);
    console.log('Device ID:', deviceESP.id);

    console.log('Connecting to device:', deviceESP);
    await connectToDevice(deviceESP);

    if (!deviceName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên thiết bị');
      return;
    }

    if (!wifiSSID.trim() || !wifiPassword.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập thông tin WiFi');
      return;
    }

    // if (!deviceId.trim()) {
    //   Alert.alert('Lỗi', 'Vui lòng quét và chọn thiết bị Bluetooth');
    //   return;
    // }

    if (!selectedType) {
      Alert.alert('Lỗi', 'Vui lòng chọn loại thiết bị');
      return;
    }
    
    if (!selectedAsset) {
      Alert.alert('Lỗi', 'Vui lòng chọn khung canh');
      return;
    }

    try {
        const newDevice = await createDevice(deviceName, deviceId, selectedType.id);
        console.log('Device created:', newDevice);

        const relation = await createDeviceAssetRelation(newDevice.id.id, selectedAsset.id.id);
        console.log('Device-Asset relation created:', relation);

        const accessToken = await getAccessToken(newDevice.id.id);
        console.log('Access token:', accessToken);

        // Tạo chuỗi cấu hình
        const configData = {
            ssid: wifiSSID,
            password: wifiPassword,
            mqttUser: accessToken,
            mqttServer: mqttServer,
            mqttPort: mqttPort
        };
        
        // Gửi cấu hình cho thiết bị
        if (deviceESP) {
            const success = await sendMessageToDevice(
                deviceESP,
                JSON.stringify(configData) + ";"
            );
            console.log('Config sent:', success);
            // Xử lý kết quả...
        }

        Alert.alert(
          'Thành công',
          `Đã thêm thiết bị "${deviceName}" (${selectedType.name}) vào hệ thống`,
          [{ text: 'OK', onPress: () => {
            if (navigation) {
              navigation.goBack();
            }
          }}]
        );

        setCreating(false);
    } catch (error) {
      console.log(error);
      Alert.alert('Lỗi', 'Không thể thêm thiết bị. Vui lòng thử lại.');
    }

    // In a real app, this would call an API to register the device
  };

  // Render each device in the list
  const renderDeviceItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.deviceItem}
      onPress={() => connectToDevice(item)}
    >
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{item.name || 'Thiết bị không tên'}</Text>
        <Text style={styles.deviceId}>{item.id}</Text>
      </View>
      <Text style={styles.connectButton}>Kết nối</Text>
    </TouchableOpacity>
  );

  if (creating) {
    return (
      <DeviceSetupScreen/>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
     
        <ScrollView style={styles.scrollView}>
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Thông tin thiết bị</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tên thiết bị</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập tên thiết bị"
                value={deviceName}
                onChangeText={setDeviceName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Loại thiết bị</Text>
              <View style={styles.typeContainer}>
                {deviceTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeOption,
                      selectedType?.id === type.id && styles.selectedType,
                    ]}
                    onPress={() => setSelectedType(type)}
                  >
                    {type.icon}
                    <Text style={styles.typeText}>{type.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>WiFi SSID</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập tên WiFi"
                value={wifiSSID}
                onChangeText={setWifiSSID}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>WiFi Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu WiFi"
                value={wifiPassword}
                onChangeText={setWifiPassword}
                secureTextEntry
              />
            </View>

            {/* <View style={styles.inputGroup}>
              <Text style={styles.label}>ID thiết bị</Text>
              <View style={styles.idInputContainer}>
                <TextInput
                  style={styles.idInput}
                  placeholder="Quét thiết bị Bluetooth"
                  value={deviceId}
                  editable={false}
                />
                <TouchableOpacity 
                  style={styles.scanButton}
                  onPress={startScan}
                  disabled={isScanning}
                >
                  <Bluetooth size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View> */}

            {/* Selection of Asset */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Chọn khung cảnh</Text>
              <TouchableOpacity
                style={styles.assetButton}
                onPress={() => setSelectModalVisible(true)}
                className='border-1 border-green-500 border rounded p-2'
              >
                <Text style={styles.assetText}>
                  {selectedAsset ? selectedAsset.name : 'Chọn khung cách'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddDevice}
          >
            <Plus size={24} color="#fff" />
            <Text style={styles.addButtonText}>Thêm thiết bị</Text>
          </TouchableOpacity>
        </View>

        <SelectAssetModal />

        {/* BLE Devices Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            stopScan();
            setModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Thiết bị Bluetooth</Text>
                <TouchableOpacity 
                  onPress={() => {
                    stopScan();
                    setModalVisible(false);
                  }}
                >
                  <X size={24} color="#333" />
                </TouchableOpacity>
              </View>

              {isScanning && (
                <View style={styles.scanningContainer}>
                  <ActivityIndicator size="large" color="#4a90e2" />
                  <Text style={styles.scanningText}>Đang quét thiết bị...</Text>
                </View>
              )}

              {devices.length > 0 ? (
                <FlatList
                  data={devices}
                  renderItem={renderDeviceItem}
                  keyExtractor={item => item.id}
                  style={styles.deviceList}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {isScanning ? 'Đang tìm kiếm thiết bị...' : 'Không tìm thấy thiết bị nào'}
                  </Text>
                </View>
              )}

              <TouchableOpacity 
                style={[styles.scanAgainButton, isScanning && styles.disabledButton]}
                onPress={startScan}
                disabled={isScanning}
              >
                <Text style={styles.scanAgainButtonText}>
                  {isScanning ? 'Đang quét...' : 'Quét lại'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    color: '#000',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  idInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  scanButton: {
    backgroundColor: '#00CC00',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeContainer: {
    // cho no tu xuong dong neu khong du khong gian
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 4,
  },
  typeOption: {
    flexBasis: 'calc(33.33% - 8px)',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  selectedType: {
    borderColor: '#00CC00',
    backgroundColor: '#f0f7ff',
  },
  typeText: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addButton: {
    backgroundColor: '#00CC00',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scanningContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  scanningText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
  deviceList: {
    maxHeight: 300,
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  deviceId: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  connectButton: {
    color: '#4a90e2',
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
  scanAgainButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  scanAgainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#a0c4e8',
  },
});

export default AddDeviceScreen;
