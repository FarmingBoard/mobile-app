import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Button, FlatList, TextInput, Modal } from 'react-native';
import { BleManager, Device, Characteristic } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl, mqttServer, mqttPort } from '../utils/ApiPath';

const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b'; // UUID cho dịch vụ tùy
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8'; // UUID cho đặc trưng tùy chỉnh

const DevicePage = () => {
    const manager = useMemo(() => new BleManager(), []);
    const [devices, setDevices] = useState([]);
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [characteristic, setCharacteristic] = useState(null);
    const [message, setMessage] = useState('');
    const [receivedMessage, setReceivedMessage] = useState('');
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isWifi, setIsWifi] = useState(false);
    const [ssidWifi, setSsidWifi] = useState('');
    const [passWifi, setPassWifi] = useState('');

    useEffect(() => {   
        const subscription = manager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                scanAndConnect();
                subscription.remove();
            }
        }, true);

        return () => {
            manager.destroy();
        };
    }, [manager]);

    const scanAndConnect = () => {
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.error(error);
                return;
            }

            if (!device) return;

            setDevices((prevDevices) => {
                if (!prevDevices.find((d) => d.id === device.id) && device.name) {
                    return [...prevDevices, device];
                }
                return prevDevices;
            });

        });
    };

    const connectToDevice = (device) => {
        console.log('Connecting to', device);
        manager.stopDeviceScan();
        device.connect()
            .then((device) => {
                setConnectedDevice(device);
                return device.discoverAllServicesAndCharacteristics();
            })
            .then((device) => {
                console.log('Connected to', device.name);
                return device.services();
            })
            .then((services) => {
                console.log('Services:', services);
                const service = services.find(s => s.uuid === SERVICE_UUID);
                if (!service) {
                    throw new Error(`Service ${SERVICE_UUID} not found on device`);
                }
                return service.characteristics();
            })
            .then((characteristics) => {
                console.log('Characteristics:', characteristics);
                const characteristic = characteristics.find(c => c.uuid === CHARACTERISTIC_UUID);
                if (!characteristic) {
                    throw new Error(`Characteristic ${CHARACTERISTIC_UUID} not found on device`);
                }
                if (!characteristic.isNotifiable) {
                    throw new Error(`Characteristic ${CHARACTERISTIC_UUID} does not support notifications`);
                }
                setCharacteristic(characteristic);
                characteristic.monitor((error, characteristic) => {
                    if (error) {
                        console.error('Monitor error:', error);
                        return;
                    }
                    if (characteristic?.value) {
                        const received = Buffer.from(characteristic.value, 'base64').toString('utf-8');
                        setReceivedMessage(received);
                    }
                });
            })
            .catch((error) => {
                console.error('Connection error:', error);
            });
    };

    const sendMessage = async (device) => {
        const newDevice = {};
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(apiUrl + '/api/device', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    "name": `ESP32-${device.id}`,   
                    "type": "",
                    "label": "",
                    "deviceData": {
                      "configuration": {
                        "type": "DEFAULT"
                      },
                      "transportConfiguration": {
                        "type": "DEFAULT",
                        "powerMode": "PSM",
                        "psmActivityTimer": 9007199254740991,
                        "edrxCycle": 9007199254740991,
                        "pagingTransmissionWindow": 9007199254740991
                      }
                    },
                    "additionalInfo": {}
                }),
            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                newDevice.id = data.id.id;
            } else {
                alert("Thiết bị đã tồn tại hoặc lỗi máy chủ");
                console.error('Failed to create devđice:', response.statusText);
                return;
            }   

        } catch (error) {
            alert("Thiết bị đã tồn tại hoặc lỗi máy chủ*");
            console.error('Error sending message:', error);
            return;
        }

        try {
            // get accestoken device
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(apiUrl + `/api/device/${newDevice.id}/credentials`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': `Bearer ${token}`,
                },
            });
            if(response.ok) {
                const data = await response.json();
                newDevice.accessToken = data.credentialsId;
            } else {
                alert("Lỗi lấy token thiết bị");
                console.error('Failed to get device access token:', response.statusText);
                return;
            }
        } catch (error) {
            alert("Lỗi hệ thống");
            console.error('Error sending message:', error);
            return;
        }

        if (connectedDevice && characteristic) {
            const data = Buffer.from(`{"ssid": "${ssidWifi}","password": "${passWifi}","mqttUser": "${newDevice.accessToken}","mqttServer": "${mqttServer}","mqttPort": ${mqttPort}};`, 'utf-8').toString('base64');
            characteristic.writeWithResponse(data)
                .then(() => {
                    console.log('Message sent:', message);
                    alert("Thêm thiết bị thành công");
                })
                .catch((error) => {
                    console.error('Write error:', error);
                });
        } else {
            console.error('No connected device or characteristic');
        }
    };

    return (
        <View className="p-4">
            <Text className="text-2xl font-bold">Thêm thiết bị mới</Text>

            <View className="flex-row items-center mt-4">
                <Text>Vui lòng nhập thông tin wifi trước mới có thể thêm</Text>
                <Text className="text-red-500">*</Text>
            </View>
            <Text className="mt-1">Tên wifi:</Text>
            <TextInput
                    className="border mt-1 text-black border-gray-300 rounded-md p-2 w-full"
                    placeholder="Tên wifi"
                    value={ssidWifi}
                    onChangeText={(text) => setSsidWifi(text)}
                />
            <Text className="mt1">Mật khẩu wifi:</Text>
            <TextInput
                    className="border mt-1 text-black mb-2 border-gray-300 rounded-md p-2 w-full"
                    placeholder="Mật khẩu wifi"
                    value={passWifi}
                    onChangeText={(text) => setPassWifi(text)}
                />
            <Button title="Lưu" className="bg-green-700" onPress={() => setIsWifi(true)} />

            { isWifi && (
                <>
                <Text className="text-xl font-medium mt-3">Các thiết bị có thể kết nối xung quanh:</Text>
                <View>
                    {
                        devices.map((item) => (
                            <View key={item.id} className="flex-row justify-between items-center p-4 bg-white rounded-lg shadow-md my-2">
                                <View>
                                    <Text>Tên: {item.name ? item.name : 'Unknown Device'}</Text>
                                    <Text>MAC: {item.id}</Text>
                                </View>
                                <Button title="Kết nối" onPress={() => connectToDevice(item)} />
                                {connectedDevice && connectedDevice.id === item.id && (
                                    <Button title="Gửi" onPress={() => sendMessage(item)} />
                                )}
                            </View>
                        ))
                    }
                </View>
                </>)
            }
        </View>
    );
};

export default DevicePage;

// import React, { useState, useEffect, useMemo } from 'react';
// import { use } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet, SafeAreaView } from 'react-native';
// import { BleManager, Device } from 'react-native-ble-plx';



// const IoTDevicesScreen = () => {
//     const bleManager = useMemo(() => new BleManager(), []);
//   const [addedDevices, setAddedDevices] = useState([]);
//   const [availableDevices, setAvailableDevices] = useState([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedDevice, setSelectedDevice] = useState(null);
//   const [wifiName, setWifiName] = useState('');
//   const [wifiPassword, setWifiPassword] = useState('');
//   const [mqttUsername, setMqttUsername] = useState('');
//   const [mqttServer, setMqttServer] = useState('');
//   const [isConnecting, setIsConnecting] = useState(false);

//   useEffect(() => {
//     const scanAndConnect = () => {
//       bleManager.startDeviceScan(null, null, (error, device) => {
//         if (error) {
//           console.error(error);
//           return;
//         }

//         if (device && device.name?.includes('ESP')) {
//             console.log('Found device:', device.name);
//             setAvailableDevices(prevDevices => {
//                 if (!prevDevices.find(d => d.id === device.id)) {
//                     return [...prevDevices, device];
//                 }
//                 return prevDevices;
//             });
//         }
//       });
//     };

//     scanAndConnect();

//     return () => {
//       bleManager.stopDeviceScan();
//     };
//   }, []);

//   const connectToDevice = async (device) => {
//     setSelectedDevice(device);
//     setIsModalVisible(true);
//   };

//   const sendWifiCredentials = async () => {
//     if (!selectedDevice) return;

//     setIsConnecting(true);
//     try {
//       const connectedDevice = await bleManager.connectToDevice(selectedDevice.id);
//       await connectedDevice.discoverAllServicesAndCharacteristics();


//       const serviceUUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
//       const characteristicUUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

//       await connectedDevice.writeCharacteristicWithResponseForService(
//         serviceUUID,
//         characteristicUUID,
//         btoa(`{
//   "ssid": "hoang",
//   "password": "1234567899",
//   "mqttUser": "WhBgSjKUWDj7qsaotQjJ",
//   "mqttServer": "192.168.69.50"
// };`)
//       );

//       setAddedDevices(prevDevices => [...prevDevices, selectedDevice]);
//       setAvailableDevices(prevDevices => prevDevices.filter(d => d.id !== selectedDevice.id));

//       setIsModalVisible(false);
//       setIsConnecting(false);
//       setSelectedDevice(null);
//       setWifiName('');
//       setWifiPassword('');
//     } catch (error) {
//       console.error('Error connecting to device:', error);
//       setIsConnecting(false);
//     }
//   };

//   const renderDeviceItem = (device, isAdded) => (
//     <View style={styles.deviceItem}>
//       <Text>{device.name}</Text>
//       {!isAdded && (
//         <TouchableOpacity onPress={() => connectToDevice(device)} style={styles.connectButton}>
//           <Text style={styles.buttonText}>Kết nối</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );

//   const renderSectionHeader = (title) => (
//     <Text style={styles.sectionTitle}>{title}</Text>
//   );

//   const renderDeviceList = () => (
//     <FlatList
//       data={[
//         { title: 'Thiết bị đã thêm', data: addedDevices },
//         { title: 'Thiết bị có thể kết nối', data: availableDevices }
//       ]}
//       renderItem={({ item }) => (
//         <>
//           {renderSectionHeader(item.title)}
//           {item.data.map(device => renderDeviceItem(device, item.title === 'Thiết bị đã thêm'))}
//         </>
//       )}
//       keyExtractor={(item, index) => `section-${index}`}
//     />
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       {renderDeviceList()}
//       <Modal visible={isModalVisible} animationType="slide" transparent>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text>Tên Wi-Fi:</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Tên Wi-Fi"
//               value={wifiName}
//               onChangeText={setWifiName}
//             />
//             <Text>Pass Wi-Fi:</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Mật khẩu Wi-Fi"
//               value={wifiPassword}
//               onChangeText={setWifiPassword}
//               secureTextEntry
//             />
//             <Text>Tên đăng nhập MQTT: </Text>
//             <TextInput 
//                 style={styles.input}
//                 placeholder="Tên đăng nhập MQTT"
//                 value={mqttUsername}
//                 onChangeText={setMqttUsername}
//             />
//             <Text>Máy chủ MQTT: </Text>
//             <TextInput
//                 style={styles.input}
//                 placeholder="Máy chủ MQTT"
//                 value={mqttServer}
//                 onChangeText={setMqttServer}
//             />
//             <TouchableOpacity onPress={sendWifiCredentials} style={styles.sendButton} disabled={isConnecting}>
//               <Text style={styles.buttonText}>{isConnecting ? 'Đang kết nối...' : 'Kết nối'}</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.cancelButton}>
//               <Text style={styles.buttonText}>Hủy</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 16,
//     marginBottom: 8,
//     paddingHorizontal: 16,
//   },
//   deviceItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E0E0E0',
//   },
//   connectButton: {
//     backgroundColor: '#007AFF',
//     padding: 8,
//     borderRadius: 4,
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 16,
//     borderRadius: 8,
//     width: '80%',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 4,
//     padding: 8,
//     marginBottom: 12,
//   },
//   sendButton: {
//     backgroundColor: '#007AFF',
//     padding: 12,
//     borderRadius: 4,
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   cancelButton: {
//     backgroundColor: '#FF3B30',
//     padding: 12,
//     borderRadius: 4,
//     alignItems: 'center',
//   },
// });

// export default IoTDevicesScreen;

