import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Lock, Unlock, DoorOpen, DoorClosed, Clock, Shield, CheckCircle, XCircle, RefreshCw } from "lucide-react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { apiUrl } from "../../utils/ApiPath"
import { ipHost } from "../../utils/ApiPath"
import { set } from "date-fns"

// Mock data for recent access attempts
// const recentAccessData = [
//   { id: 1, user: "Nguyễn Văn A", time: "10:30 AM", success: true, cardId: "RFID-1234" },
//   { id: 2, user: "Unknown", time: "11:45 AM", success: false, cardId: "RFID-5678" },
//   { id: 3, user: "Trần Thị B", time: "01:15 PM", success: true, cardId: "RFID-9012" },
//   { id: 4, user: "Lê Văn C", time: "03:20 PM", success: true, cardId: "RFID-3456" },
// ]

export default function DoorAccessControl({ device }) {
  const [lockStatus, setLockStatus] = useState("locked") // 'locked' or 'unlocked'
  const [isLoading, setIsLoading] = useState(false)
  const [accessHistory, setAccessHistory] = useState([])
  const [showAddCardModal, setShowAddCardModal] = useState(false)
  const [newCardId, setNewCardId] = useState("")
  const [newCardUser, setNewCardUser] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [accessLevel, setAccessLevel] = useState("Standard") // 'Standard', 'Admin', 'Limited'
  const [newCard, setNewCard] = useState("")


  const fetchRecentAccessData = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
    // /api/plugins/telemetry/{entityType}/{entityId}/values/timeseries{?keys,startTs,endTs,intervalType,interval,timeZone,limit,agg,orderBy,useStrictDataTypes}
    // tach thanh cac param xuong dong
    const params = {
      keys: 'open,RFID',
      startTs: 0,
      endTs: Date.now(),
      interval: 0,
      limit: 5,
      agg: 'NONE',
      orderBy: 'DESC',
      useStrictDataTypes: false
    }
    // ãios
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    const url = `${apiUrl}/api/plugins/telemetry/DEVICE/${device.id}/values/timeseries?${queryString}`;
    console.log(url)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log(data);
    if(data) {
      console.log(data);
      const recentAccessData = data.open.map((item, index) => {
        return {
          open: item.value == "true",
          RFID: data.RFID[index].value,
          time: new Date(item.ts).toLocaleTimeString(),
          success: item.value == "true"
        }
      })
      console.log(recentAccessData)
      setAccessHistory(recentAccessData)
    }
    else {
      setAccessHistory([])
    }
    
  }

  useEffect(() => {
    fetchRecentAccessData();
  }, [device])

  // websocket connect
  useEffect(() => {
    const fetchTokenAndConnect = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('Token not found');
          return;
        }

        const ws = new WebSocket(`ws://${ipHost}:8080/api/ws/plugins/telemetry?token=${token}`);

        ws.onopen = () => {
          console.log('WebSocket connection established');
          const subscriptionMessage = {
            tsSubCmds: [
              {
                entityType: 'DEVICE',
                entityId: device.id,
                scope: 'LATEST_TELEMETRY',
              },
            ],
            historyCmds: [],
          };
          ws.send(JSON.stringify(subscriptionMessage));
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.data) {
            const latestData = data.data;
            console.log(latestData)
            if(latestData.open) {
              setLockStatus(latestData.open[0][1] == "false" ? 'locked' : 'unlocked');
            }
            if(latestData.newCard){
              setNewCardId(latestData.newCard[0][1])
              if(latestData.newCard[0][1] != null){
                alert("New card ID: " + latestData.newCard[0][1])
                setIsScanning(false)
              } else {
                alert("No card detected")
                setIsScanning(false)
              }
            }
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error.message);
        };

        ws.onclose = () => {
          console.log('WebSocket connection closed');
        };

        return () => {
          ws.close();
        };
      } catch (error) {
        console.error('Error fetching token or connecting WebSocket:', error);
      }
    };
    fetchTokenAndConnect()
  }, [device])

  // fetch lock status
  useEffect(() => {
    const fetchLockStatus = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) {
            console.error('Token not found');
            return;
          }
          const response = await fetch(`${apiUrl}/api/plugins/telemetry/DEVICE/${device.id}/values/attributes/SHARED_SCOPE`, {
            headers: {
              'Content-Type': 'application/json',
              'X-Authorization': `Bearer ${token}`,
            },
          });
          const data = await response.json();
          console.log(data);
          if (data) {
            const servoState = data.find(item => item.key === 'servoState')?.value;
            if(servoState) {
              setLockStatus(servoState == 1 ? 'locked' : 'unlocked');
            }
          }
        } catch (error) {
            console.error('Error fetching attributes:', error);
        }   
    }
    fetchLockStatus()
  }, [device])


  // Simulate toggling the door lock
  const toggleLock = async () => {
    setIsLoading(true)

    const deviceId = device?.id;
    if (!deviceId) return;
    
    try {
      const accessToken = await AsyncStorage.getItem("token");
      
      const response = await fetch(`${apiUrl}/api/plugins/telemetry/${deviceId}/SHARED_SCOPE`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          servoState: lockStatus == 'locked' ? 1 : 0
        }),
      });
    
      if (response.ok) {
        setLockStatus(lockStatus == 'locked' ? 'unlocked' : 'locked')
        setIsLoading(false)
        console.log("Lock state updated successfully");
      } else {
        console.error("Failed to update lock state:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating lock state:", error);
    }
  }

  // Simulate refreshing access history
  const refreshHistory = () => {
    setIsLoading(true)
    fetchRecentAccessData();
    setIsLoading(false)
  }

  // Handle adding a new card
  const handleAddCard = async () => {
    console.log(newCard);
    if (!newCard) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin thẻ và người dùng")
      return
    }
    setIsLoading(true)

    let currentCards = [];

    // get attribute RDIS_UISs 
    const getRFID_UIDs = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('Token not found');
          return;
        }
        const response = await fetch(`${apiUrl}/api/plugins/telemetry/DEVICE/${device.id}/values/attributes/SHARED_SCOPE`, {
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data);
        if (data) {
          const RFID_UIDs = data.find(item => item.key === 'RFID_UIDs')?.value;
          console.log(RFID_UIDs)
          if(RFID_UIDs) {
            // RFID_UIDS = ["a335e824","33587438"]
            // ep string sang mang
            currentCards = RFID_UIDs; 
          }
        }
      } catch (error) {
          console.error('Error fetching attributes:', error);
      }
    }
    await getRFID_UIDs()

    // add to attribute RFID_UIDs
    const addCard = async () => {
      setIsLoading(true)
      const deviceId = device?.id;
      if (!deviceId) return;

      currentCards.push(newCard)
      console.log(currentCards)
      
      try {
        const accessToken = await AsyncStorage.getItem("token");
        
        const response = await fetch(`${apiUrl}/api/plugins/telemetry/${deviceId}/SHARED_SCOPE`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            RFID_UIDs: currentCards
          }),
        });
      
        if (response.ok) {
          console.log("Add card successfully");
        } else {
          console.error("Failed to add card:", response.statusText);
        }
      } catch (error) {
        console.error("Error adding card:", error);
      }
    }

    await addCard();
    setIsLoading(false)
  }

  // Simulate scanning a new card
  const simulateScanCard = async () => {
    setIsScanning(true) 
    const deviceId = device?.id;
    if (!deviceId) return;
    
    try {
      const accessToken = await AsyncStorage.getItem("token");
      
      const response = await fetch(`${apiUrl}/api/plugins/telemetry/${deviceId}/SHARED_SCOPE`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          readNewCard: true
        }),
      });
    
      if (response.ok) {
        console.log("Send ok successfully");
      } else {
        console.error("Faile send:", response.statusText);
      }
    } catch (error) {
      console.error("Error send:", error);
    }
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="p-4">
        <Text className="text-xl font-bold text-gray-800">Kiểm Soát Cửa Ra Vào</Text>
        <Text className="text-gray-500 text-sm mb-4">Hệ thống quản lý cửa bằng thẻ RFID</Text>
      </View>

      {/* Door Status Card */}
      <View className="mx-4 bg-white rounded-xl shadow-md overflow-hidden mb-4">
        <View className="p-5">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-800">Trạng Thái Cửa</Text>
            <View className={`px-3 py-1 rounded-full ${lockStatus != "locked" ? "bg-green-100" : "bg-blue-100"}`}>
              <Text className={`${lockStatus != "locked" ? "text-green-800" : "text-blue-800"} font-medium`}>
                {lockStatus != "locked" ? "Đang Mở" : "Đã Đóng"}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-center items-center py-8 bg-gray-50 rounded-lg">
            {lockStatus != "locked" ? <DoorOpen size={80} color="#10b981" /> : <DoorClosed size={80} color="#3b82f6" />}
          </View>

          <View className="mt-4 flex-row justify-between items-center">
            <View className="flex-row items-center">
              {lockStatus === "locked" ? (
                <Lock size={20} color="#ef4444" className="mr-2" />
              ) : (
                <Unlock size={20} color="#10b981" className="mr-2" />
              )}
              <Text className="text-gray-700">{lockStatus === "locked" ? "Đã Khóa" : "Đã Mở Khóa"}</Text>
            </View>

            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${lockStatus === "locked" ? "bg-green-500" : "bg-red-500"} ${isLoading ? "opacity-50" : ""}`}
              onPress={toggleLock}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw size={20} color="white" className="animate-spin" />
              ) : (
                <Text className="text-white font-medium">{lockStatus === "locked" ? "Mở Khóa" : "Khóa Lại"}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Add New Card Button */}
      <TouchableOpacity
        className="mx-4 mb-4 p-4 bg-purple-500 rounded-lg flex-row justify-center items-center"
        onPress={() => setShowAddCardModal(true)}
      >
        <Shield size={20} color="white" className="mr-2" />
        <Text className="text-white font-medium">Thêm Thẻ RFID Mới</Text>
      </TouchableOpacity>

      {/* Recent Access Card */}
      <View className="mx-4 bg-white rounded-xl shadow-md overflow-hidden flex-1">
        <View className="p-5">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-800">Lịch Sử Truy Cập Gần Đây</Text>
            <TouchableOpacity onPress={refreshHistory} disabled={isLoading}>
              <RefreshCw size={20} color="#6b7280" style={isLoading ? { transform: [{ rotate: "45deg" }] } : {}} />
            </TouchableOpacity>
          </View>

          <ScrollView className="max-h-64">
            {accessHistory.map((access) => (
              <View key={access.time} className="flex-row items-center py-3 border-b border-gray-100">
                {access.open ? (
                  <CheckCircle size={20} color="#10b981" className="mr-3" />
                ) : (
                  <CheckCircle size={20} color="#ef4444" className="mr-3" />
                )}

                <View className="flex-1 ml-2">
                  <Text className="font-medium text-gray-800">{access.RFID}</Text>
                  <View className="flex-row items-center mt-1">
                    <Clock size={14} color="#9ca3af" className="mr-1" />
                    <Text className="ml-2 text-xs text-gray-500">{access.time}</Text>
                  </View>
                </View>

                <View className={`px-2 py-1 rounded-full ${access.success ? "bg-green-100" : "bg-red-100"}`}>
                  <Text className={`text-xs ${access.success ? "text-green-800" : "text-red-800"}`}>
                    {access.open ? "Mở cửa" : "Đóng cửa"}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Security Status */}
      <View className="m-4 p-4 bg-blue-50 rounded-lg flex-row items-center">
        <Shield size={24} color="#3b82f6" className="mr-3" />
        <View className="flex-1">
          <Text className="font-medium text-blue-800">Hệ thống an ninh đang hoạt động</Text>
          <Text className="text-sm text-blue-600">Cửa được bảo vệ bằng hệ thống RFID</Text>
        </View>
      </View>

      {/* Add Card Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddCardModal}
        onRequestClose={() => setShowAddCardModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="m-5 bg-white rounded-xl p-5 w-11/12 max-w-md">
            <Text className="text-xl font-bold text-gray-800 mb-4">Thêm Thẻ RFID Mới</Text>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Mã Thẻ RFID</Text>
              <View className="flex-row">
                <TextInput
                  className="flex-1 border border-gray-300 rounded-l-lg p-2 bg-gray-50"
                  placeholder="Nhập hoặc quét mã thẻ"
                  value={newCard}
                  onChangeText={setNewCard}
                />
                <TouchableOpacity
                  className={`rounded-r-lg bg-blue-500 justify-center items-center px-3 ${isScanning ? "bg-blue-300" : ""}`}
                  onPress={simulateScanCard}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <RefreshCw size={20} color="white" style={{ transform: [{ rotate: "45deg" }] }} />
                  ) : (
                    <Text className="text-white">Quét</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row justify-between">
              <TouchableOpacity className="px-4 py-2 rounded-lg bg-gray-300" onPress={() => setShowAddCardModal(false)}>
                <Text className="text-gray-800 font-medium">Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`px-4 py-2 rounded-lg bg-green-500 ${isLoading ? "opacity-50" : ""}`}
                onPress={handleAddCard}
                disabled={isLoading || !newCard}
              >
                {isLoading ? (
                  <RefreshCw size={20} color="white" style={{ transform: [{ rotate: "45deg" }] }} />
                ) : (
                  <Text className="text-white font-medium">Thêm Thẻ</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

