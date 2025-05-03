import { useState } from "react"
import { useScript } from "../../contexts/ScriptContext"
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
  PanResponder,
  Alert,
} from "react-native"
import { ChevronRight, Plus, Clock, Sun, Thermometer, Trash2, WindIcon, Cloud } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"

const SwipeableItem = ({ children, onDelete }) => {
  const pan = new Animated.ValueXY()
  const opacity = new Animated.Value(1)

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 5
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx < 0) {
        // Only allow swiping left
        pan.x.setValue(gestureState.dx)
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < -100) {
        // If swiped far enough left, trigger delete
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          onDelete()
        })
      } else {
        // Otherwise, reset position
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 5,
          useNativeDriver: true,
        }).start()
      }
    },
  })

  return (
    <View style={{ overflow: "hidden" }}>
      <View
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 80,
          backgroundColor: "#FF3B30",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Trash2 size={24} color="white" />
      </View>
      <Animated.View
        style={{
          transform: [{ translateX: pan.x }],
          opacity: opacity,
          backgroundColor: "white",
        }}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  )
}

const CreateSceneScreen = () => {
  const navigation = useNavigation()
  const { triggers, actions, setTriggers, setActions } = useScript()
  const [conditionType, setConditionType] = useState("any") // "any" or "all"

  // Helper function to format days
  const formatDays = (days) => {
    if (!days || days.length === 0) return ""

    const dayMap = {
      2: "Thứ hai",
      3: "Thứ ba",
      4: "Thứ tư",
      5: "Thứ năm",
      6: "Thứ sáu",
      7: "Thứ bảy",
      8: "Chủ nhật",
    }

    return days.map((day) => dayMap[day]).join(", ")
  }

  const weatherOptions = {
    Clear: 'Nắng',
    Clouds: 'Nhiều mây',
    Rain: 'Mưa',
    Snow: 'Tuyết rơi',
    Fog: 'Sương mù',
    Thunderstorm: 'Giông bão',
    Drizzle: 'Mưa phùn',
    Mist: 'Sương mù nhẹ',
    Haze: 'Khói mù',
  };

  // Helper function to format operator
  const formatOperator = (op) => {
    switch (op) {
      case ">":
        return "Bên trên"
      case "<":
        return "Bên dưới"
      case ">=":
        return "Bên trên hoặc bằng"
      case "<=":
        return "Bên dưới hoặc bằng"
      case "=":
        return "Bằng"
      default:
        return op
    }
  }

  // Delete condition handler
  const handleDeleteCondition = (triggerIndex, conditionIndex) => {
    Alert.alert(
      "Xóa điều kiện",
      "Bạn có chắc chắn muốn xóa điều kiện này không?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => {
            setTriggers((prevTriggers) => {
              const updatedTriggers = [...prevTriggers]
              updatedTriggers[triggerIndex].conditions.splice(conditionIndex, 1)
              return updatedTriggers
            })
            console.log(`Deleting condition ${conditionIndex} from trigger ${triggerIndex}`)
            // Here you would update your triggers state to remove the condition
          },
        },
      ],
      { cancelable: true },
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f6fa" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f6fa" />

      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <TouchableOpacity onPress={() => navigation.navigate("Kịch bản")}>
          <Text style={{ color: "#666", fontSize: 16 }}>Hủy bỏ</Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#333",
            marginTop: 16,
            marginBottom: 16,
          }}
        >
          Tạo cảnh
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* If Section */}
        <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "600", color: "#333" }}>Nếu</Text>
              <TouchableOpacity
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: "#4CD964",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  navigation.navigate("Tạo kịch bản");
                }}
              >
                <Plus size={18} color="white" />
              </TouchableOpacity>
            </View>

            {/* Condition Type Selector */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#F0F0F0",
                borderRadius: 8,
                marginBottom: 16,
                padding: 2,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  alignItems: "center",
                  backgroundColor: conditionType === "any" ? "#FFFFFF" : "transparent",
                  borderRadius: 6,
                }}
                onPress={() => setConditionType("any")}
              >
                <Text
                  style={{
                    color: conditionType === "any" ? "#4CD964" : "#666",
                    fontWeight: conditionType === "any" ? "600" : "400",
                  }}
                >
                  Một trong các điều kiện
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  alignItems: "center",
                  backgroundColor: conditionType === "all" ? "#FFFFFF" : "transparent",
                  borderRadius: 6,
                }}
                onPress={() => setConditionType("all")}
              >
                <Text
                  style={{
                    color: conditionType === "all" ? "#4CD964" : "#666",
                    fontWeight: conditionType === "all" ? "600" : "400",
                  }}
                >
                  Tất cả điều kiện
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>
              {conditionType === "any"
                ? "Khi một trong các điều kiện được thỏa mãn"
                : "Khi tất cả các điều kiện được thỏa mãn"}
            </Text>

            {/* Condition Items */}
            {triggers &&
              triggers.map((trigger, triggerIndex) => {
                if (trigger.type === "WEATHER") {
                  console.log(trigger);
                  return trigger.conditions.map((condition, condIndex) => (
                    <SwipeableItem
                      key={`weather-${triggerIndex}-${condIndex}`}
                      onDelete={() => handleDeleteCondition(triggerIndex, condIndex)}
                    >
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          paddingVertical: 12,
                          borderBottomWidth: 1,
                          borderBottomColor: "#f0f0f0",
                        }}
                        onPress={() => {
                          if(condition.key === "weather") {
                            navigation.navigate("Trạng thái thời tiết", {
                              triggerIndex,
                              condIndex,
                            })
                          }
                          if(condition.key === "sun") {
                            navigation.navigate("Mặt trời", {
                              triggerIndex,
                              condIndex,
                            })
                          }
                          if(condition.key === "temp") {
                            console.log("Nhiệt độ");
                            navigation.navigate("Nhiệt độ", {
                              triggerIndex,
                              condIndex,
                            })
                          }
                          if(condition.key === "humidity") {
                            navigation.navigate("Độ ẩm", {
                              triggerIndex,
                              condIndex,
                            })
                          }
                          if(condition.key === "wind_speed") {
                            navigation.navigate("Gió", {
                              triggerIndex,
                              condIndex,
                            })
                          }
                        }}
                      >
                        <View style={{ marginRight: 12 }}>
                          {condition.key === "temp" && <Thermometer size={22} color="#4A87F5" />}
                          {condition.key === "humidity" && <Thermometer size={22} color="#4A87F5" />}
                          {condition.key === "wind_speed" && <WindIcon size={22} color="#4A87F5" />}
                          {condition.key === "weather" && <Cloud size={22} color="#4A87F5" />}
                          {condition.key === "sun" && <Sun size={22} color="#4A87F5" />}
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 16, color: "#333" }}>
                            {condition.key === "temp" && `Nhiệt độ: ${formatOperator(condition.operator)} ${condition.value}°C`}
                            {condition.key === "humidity" && `Độ ẩm: ${formatOperator(condition.operator)} ${condition.value}%`}
                            {condition.key === "wind_speed" && `Gió: ${formatOperator(condition.operator)} ${condition.value}m/s`}
                            {condition.key === "weather" && `Thời tiết: ${weatherOptions[condition.value]}`}
                            {condition.key === "sun" && `Thời điểm: ${condition.value}`}
                          </Text>
                          <Text style={{ fontSize: 13, color: "#999", marginTop: 2 }}>Thạch Hà</Text>
                        </View>
                        <ChevronRight size={20} color="#CCCCCC" />
                      </TouchableOpacity>
                    </SwipeableItem>
                  ))
                } else if (trigger.type === "SCHEDULE") {
                  return trigger.conditions.map((condition, condIndex) => (
                    <SwipeableItem
                      key={`schedule-${triggerIndex}-${condIndex}`}
                      onDelete={() => handleDeleteCondition(triggerIndex, condIndex)}
                    >
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          paddingVertical: 12,
                          borderBottomWidth:
                            condIndex < trigger.conditions.length - 1 || triggerIndex < triggers.length - 1 ? 1 : 0,
                          borderBottomColor: "#f0f0f0",
                        }}
                        onPress={() => {
                          console.log("Lên lịch");
                          navigation.navigate("Lên lịch", {triggerIndex: triggerIndex, conditionIndex: condIndex});
                        }}
                      >
                        <View style={{ marginRight: 12 }}>
                          <Clock size={22} color="#4A87F5" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 16, color: "#333" }}>Lịch: {condition.time}</Text>
                          <Text style={{ fontSize: 13, color: "#999", marginTop: 2 }}>
                            {formatDays(condition.days)}
                          </Text>
                        </View>
                        <ChevronRight size={20} color="#CCCCCC" />
                      </TouchableOpacity>
                    </SwipeableItem>
                  ))
                } else if(trigger.type === "DEVICE") {
                  /*
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
                  */
                  return trigger.conditions.map((condition, condIndex) => (
                    <SwipeableItem
                      key={`device-${triggerIndex}-${condIndex}`}
                      onDelete={() => handleDeleteCondition(triggerIndex, condIndex)}
                    >
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          paddingVertical: 12,
                          borderBottomWidth: 1,
                          borderBottomColor: "#f0f0f0",
                        }}
                        onPress={() => {
                          navigation.navigate("Thiết bị", {
                            triggerIndex,
                            condIndex,
                          })
                        }}
                      >
                        <View style={{ marginRight: 12 }}>
                          <Sun size={22} color="#4A87F5" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 16, color: "#333" }}>
                            Thiết bị {condition.deviceName}
                          </Text>
                          <Text style={{ fontSize: 13, color: "#999", marginTop: 2 }}>
                            {condition.conditions.map((cond, index) => (
                              <Text key={index}>
                                {cond.key === "soilMoisture" && `Độ ẩm đất: ${formatOperator(cond.operator)} ${cond.value}%`}
                                {cond.key === "light" && `Ánh sáng: ${formatOperator(cond.operator)} ${cond.value}lux`}
                                {cond.key === "rain" && `Lượng mưa: ${formatOperator(cond.operator)} ${cond.value}mm`}
                                {cond.key === "humidity" && `Độ ẩm không khí: ${formatOperator(cond.operator)} ${cond.value}%`}
                                {cond.key === "temperature" && `Nhiệt độ: ${formatOperator(cond.operator)} ${cond.value}°C`}
                              </Text>
                            ))}
                          </Text>
                        </View>
                        <ChevronRight size={20} color="#CCCCCC" />
                      </TouchableOpacity>
                    </SwipeableItem>
                  ))
                }
              })}

            {/* Add a placeholder if no conditions */}
            {(!triggers || triggers.length === 0) && (
              <View
                style={{
                  padding: 16,
                  alignItems: "center",
                  borderStyle: "dashed",
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#999" }}>Thêm điều kiện</Text>
              </View>
            )}
          </View>
        </View>

        {/* Then Section */}
        <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#333" }}>Thực hiện</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("ActionList")}
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: "#4CD964",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Plus size={18} color="white" />
            </TouchableOpacity>
          </View>

          {/* Action Placeholder */}
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              padding: 16,
              borderRadius: 12,
              alignItems: "center",
              marginBottom: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 1,
              borderWidth: 1,
              borderColor: "#e0e0e0",
              borderStyle: "dashed",
            }}
          >
            <Text style={{ fontSize: 16, color: "#999" }}>Thêm hành động thực thi</Text>
          </TouchableOpacity>
        </View>

        {/* Display Settings */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
            padding: 16,
            marginHorizontal: 16,
            borderRadius: 12,
            marginBottom: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <Text style={{ fontSize: 16, color: "#333" }}>Cài đặt hiển thị</Text>
          <ChevronRight size={20} color="#CCCCCC" />
        </TouchableOpacity>
      </ScrollView>

      {/* Save Button */}
      <View style={{ padding: 16, backgroundColor: "#f5f6fa" }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#4CD964",
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: "center",
            shadowColor: "#4CD964",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default CreateSceneScreen
