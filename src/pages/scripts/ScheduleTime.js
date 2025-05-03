import { useState, useRef, useEffect } from "react"
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Modal, FlatList } from "react-native"
import { useScript } from '../../contexts/ScriptContext';
import { ArrowLeft, ChevronRight, Check } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import { useRoute } from "@react-navigation/native"

const ITEM_HEIGHT = 50
const VISIBLE_ITEMS = 3

const ScheduleTimeScreen = () => {
  const route = useRoute();
  const { triggerIndex, conditionIndex } = route.params || {};
  const { triggers, actions, setTriggers, setActions } = useScript();
  const navigation = useNavigation()
  // State for selected hour and minute
  const [selectedHour, setSelectedHour] = useState(23)
  const [selectedMinute, setSelectedMinute] = useState(21)

  // State for repeat modal
  const [repeatModalVisible, setRepeatModalVisible] = useState(false)

  // State for selected days
  const [selectedDays, setSelectedDays] = useState([])

  // Refs for scroll position
  const hourScrollRef = useRef(null)
  const minuteScrollRef = useRef(null)

  // Days of the week in Vietnamese
  const daysOfWeek = [
    { id: 2, name: "Thứ 2" },
    { id: 3, name: "Thứ 3" },
    { id: 4, name: "Thứ 4" },
    { id: 5, name: "Thứ 5" },
    { id: 6, name: "Thứ 6" },
    { id: 7, name: "Thứ 7" },
    { id: 8, name: "Chủ nhật" },
  ]

  // Generate hours (0-23) and minutes (0-59) for the picker
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  // Scroll to selected hour and minute when component mounts
  useEffect(() => {
    console.log(route.params);
    if (triggerIndex != undefined && conditionIndex != undefined) {
      const trigger = triggers[triggerIndex]
      const condition = trigger.conditions[conditionIndex]
      setSelectedHour(pre => {
        condition.time.split(":")[0]
        hourScrollRef.current?.scrollToIndex({
          index: condition.time.split(":")[0],
          animated: true,
        })
        return condition.time.split(":")[0]
     })
      setSelectedMinute(pre => {
        condition.time.split(":")[1]
        minuteScrollRef.current?.scrollToIndex({
          index: condition.time.split(":")[1],
          animated: true,
        })
        return condition.time.split(":")[1]
      })
      setSelectedDays(pre => {
        condition.days
        return condition.days
      })
    }
  }, [])

  // Hàm lưu lịch vào context
  const handleSaveSchedule = () => {
    setSchedule({ hour: selectedHour, minute: selectedMinute, days: selectedDays });
    navigation.goBack();
  };

// Handle scroll end for hour selection
  const handleHourScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y
    const index = Math.round(y / ITEM_HEIGHT)
    if (index >= 0 && index < hours.length) {
      setSelectedHour(index)

    }
  }

  // Handle scroll end for minute selection
  const handleMinuteScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y
    const index = Math.round(y / ITEM_HEIGHT)
    if (index >= 0 && index < minutes.length) {
      setSelectedMinute(index)
 
    }
  }

  // Toggle day selection
  const toggleDaySelection = (dayId) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter((id) => id !== dayId))
    } else {
      setSelectedDays([...selectedDays, dayId])
    }
  }

  // Format selected days for display
  const getRepeatText = () => {
    if (selectedDays.length === 0) {
      return "Chỉ một"
    } else if (selectedDays.length === 7) {
      return "Hàng ngày"
    } else if (selectedDays.length === 5 && [2, 3, 4, 5, 6].every((day) => selectedDays.includes(day))) {
      return "Các ngày trong tuần"
    } else if (selectedDays.length === 2 && [7, 8].every((day) => selectedDays.includes(day))) {
      return "Cuối tuần"
    } else {
      // Sort days and format them
      const sortedDays = [...selectedDays].sort((a, b) => a - b)
      return sortedDays
        .map((day) => {
          if (day === 8) return "CN"
          return `T${day}`
        })
        .join(", ")
    }
  }

  const handleAddSchedule = () => {
    /// luu vao scheule vao trigger dạng
    /*
    "trigger": [
    {
      "type": "SCHEDULE",
      "conditions": [
        {
          "time": "20:48",
          "utcOffset": 7,
          "days": [
            2,
            3
          ]
        }
      ]
    },
    {
      "type": "WEATHER",
      "conditions": [
        {
          "key": "temperature",
          "operator": ">",
          "value": 20
        },
        {
          "key": "humidity",
          "operator": "<",
          "value": 80
        }
      ]
    },
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
        */
    
      const schedule = {
        type: "SCHEDULE",
        conditions: [
          {
            time: `${selectedHour}:${selectedMinute}`,
            utcOffset: 7,
            days: selectedDays
          }
        ]
      }
      console.log(selectedDays);
      setTriggers(pre => {
        // tim toi cai la schedule
        if(pre == null) {
          return [schedule];
        }
        const index = pre?.findIndex(item => item.type === "SCHEDULE");
        if(index === -1){
          return [...pre, schedule];
        }
        else{
          if(triggerIndex != undefined && conditionIndex != undefined) {
            const newTriggers = [...pre];
            newTriggers[index].conditions[conditionIndex] = schedule.conditions[0];
            return newTriggers;
          }
          const newTriggers = [...pre];
          newTriggers[index].conditions.push(schedule.conditions[0]);
          return newTriggers;
        }
      });
      // navigation.goBack();
  }

  // Render time picker item
  const renderTimeItem = ({ item, index }, isHour, selectedValue) => {
    const isSelected = item === selectedValue
    return (
      <View
        style={{
          height: ITEM_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: isSelected ? 24 : 20,
            fontWeight: isSelected ? "500" : "400",
            color: isSelected ? "#333" : "#999",
          }}
        >
          {item.toString().padStart(2, "0")}
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#f0f0f0",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 18,
            fontWeight: "500",
          }}
        >
          Lịch
        </Text>
        <TouchableOpacity
          onPress={() => {
            handleAddSchedule();
            navigation.navigate("Điều kiện")
          }}
        >
          <Text style={{ color: "#4CD964", fontSize: 16, fontWeight: "500" }}>Tiếp theo</Text>
        </TouchableOpacity>
      </View>

      {/* Repeat Option */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 16,
          backgroundColor: "white",
        }}
      >
        <Text style={{ fontSize: 16, color: "#333" }}>Lặp lại</Text>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => setRepeatModalVisible(true)}
        >
          <Text
            style={{
              fontSize: 16,
              color: selectedDays.length > 0 ? "#4CD964" : "#999",
              marginRight: 8,
            }}
          >
            {getRepeatText()}
          </Text>
          <ChevronRight size={20} color="#CCCCCC" />
        </TouchableOpacity>
      </View>

      {/* Time Picker Section */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#f5f6fa",
          paddingTop: 24,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: "#666",
            marginLeft: 16,
            marginBottom: 24,
          }}
        >
          Đặt thời gian bắt đầu
        </Text>

        {/* Time Picker */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: ITEM_HEIGHT * VISIBLE_ITEMS,
          }}
        >
          {/* Hours Column */}
          <View
            style={{
              width: 80,
              height: ITEM_HEIGHT * VISIBLE_ITEMS,
            }}
          >
            <FlatList
              ref={hourScrollRef}
              data={hours}
              keyExtractor={(item) => `hour-${item}`}
              renderItem={(props) => renderTimeItem(props, true, selectedHour)}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              onMomentumScrollEnd={handleHourScroll}
              getItemLayout={(data, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
              contentContainerStyle={{
                paddingVertical: ITEM_HEIGHT,
              }}
            />
            {/* Selection indicator */}
            <View
              style={{
                position: "absolute",
                top: ITEM_HEIGHT,
                left: 0,
                right: 0,
                height: ITEM_HEIGHT,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: "#4CD964",
                backgroundColor: "rgba(76, 217, 100, 0.05)",
                pointerEvents: "none",
              }}
            />
          </View>

          {/* Colon */}
          <Text style={{ fontSize: 24, marginHorizontal: 16 }}>:</Text>

          {/* Minutes Column */}
          <View
            style={{
              width: 80,
              height: ITEM_HEIGHT * VISIBLE_ITEMS,
            }}
          >
            <FlatList
              ref={minuteScrollRef}
              data={minutes}
              keyExtractor={(item) => `minute-${item}`}
              renderItem={(props) => renderTimeItem(props, false, selectedMinute)}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              onMomentumScrollEnd={handleMinuteScroll}
              getItemLayout={(data, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
              contentContainerStyle={{
                paddingVertical: ITEM_HEIGHT,
              }}
            />
            {/* Selection indicator */}
            <View
              style={{
                position: "absolute",
                top: ITEM_HEIGHT,
                left: 0,
                right: 0,
                height: ITEM_HEIGHT,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: "#4CD964",
                backgroundColor: "rgba(76, 217, 100, 0.05)",
                pointerEvents: "none",
              }}
            />
          </View>
        </View>
      </View>

      {/* Repeat Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={repeatModalVisible}
        onRequestClose={() => setRepeatModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              paddingBottom: 30,
            }}
          >
            {/* Modal Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: "#f0f0f0",
              }}
            >
              <TouchableOpacity onPress={() => setRepeatModalVisible(false)}>
                <Text style={{ color: "#999", fontSize: 16 }}>Hủy</Text>
              </TouchableOpacity>
              <Text
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "500",
                }}
              >
                Lặp lại
              </Text>
              <TouchableOpacity onPress={() => setRepeatModalVisible(false)}>
                <Text style={{ color: "#4CD964", fontSize: 16, fontWeight: "500" }}>Xong</Text>
              </TouchableOpacity>
            </View>

            {/* Custom Day Selection */}
            <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
              <Text style={{ fontSize: 16, color: "#666", marginBottom: 16 }}>Tùy chỉnh</Text>
              <FlatList
                data={daysOfWeek}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingVertical: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: "#f0f0f0",
                    }}
                    onPress={() => toggleDaySelection(item.id)}
                  >
                    <Text style={{ fontSize: 16, color: "#333" }}>{item.name}</Text>
                    {selectedDays.includes(item.id) && <Check size={20} color="#4CD964" />}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default ScheduleTimeScreen
