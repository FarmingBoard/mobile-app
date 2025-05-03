import { useState, useCallback } from "react"
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, FlatList, Switch, RefreshControl } from "react-native"
import { Link2, Plus, ChevronRight, Menu } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import useGetAssets from "../../hooks/useGetAssets"

const AutomationScreen = () => {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState("auto") // "auto" or "touch"
  const [refreshing, setRefreshing] = useState(false)
  const { assets, loading, setRefresh } = useGetAssets("Cảnh thông minh")

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setRefresh((prev) => !prev) // Toggle refresh state in the hook
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }, [setRefresh])

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f5f6fa" />
      <View className="bg-white pt-4 pb-4 px-5 shadow-sm">
        <View className="flex-row items-center">
          <Text className="text-xl font-bold text-gray-800">Kịch bản</Text>
          <View className="ml-auto flex-row justify-center items-center">
            <TouchableOpacity className="mr-2">
              <Menu size={24} color="#333333" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-green-400 p-1 rounded-full" onPress={() => navigation.navigate("Tạo kịch bản")}>
              <Plus size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Tab Navigation */}
      <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingVertical: 12 }}>
        <TouchableOpacity
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderBottomWidth: activeTab === "auto" ? 2 : 0,
            borderBottomColor: "#333333",
          }}
          onPress={() => setActiveTab("auto")}
        >
          <Text
            style={{
              fontWeight: activeTab === "auto" ? "600" : "400",
              color: activeTab === "auto" ? "#333333" : "#888888",
              fontSize: 16,
            }}
          >
            Tự động
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderBottomWidth: activeTab === "touch" ? 2 : 0,
            borderBottomColor: "#333333",
            marginLeft: 16,
          }}
          onPress={() => setActiveTab("touch")}
        >
          <Text
            style={{
              fontWeight: activeTab === "touch" ? "600" : "400",
              color: activeTab === "touch" ? "#333333" : "#888888",
              fontSize: 16,
            }}
          >
            Chạm để Chạy
          </Text>
        </TouchableOpacity>
      </View>

      {/* Automatic Tab Content */}
      {activeTab === "auto" && (
        <>
          {/* Empty State Content */}
          {assets?.length === 0 && !loading && (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40 }}>
              {/* Circle with Icon */}
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "#e0e0e0",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <Link2 size={32} color="#a0a0a0" />
              </View>

              {/* Description Text */}
              <Text
                style={{
                  textAlign: "center",
                  color: "#888888",
                  fontSize: 15,
                  lineHeight: 22,
                  marginBottom: 40,
                }}
              >
                Thực thi tự động theo các điều kiện như thời tiết, trạng thái của thiết bị và thời gian
              </Text>

              {/* Create Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: "#4CD964",
                  paddingVertical: 14,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                  width: "100%",
                  alignItems: "center",
                }}
                onPress={() => navigation.navigate("Tạo kịch bản")}
              >
                <Text style={{ color: "white", fontWeight: "500", fontSize: 16 }}>Tạo kịch bản</Text>
              </TouchableOpacity>
            </View>
          )}
          {loading && (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ color: "#888888", fontSize: 15 }}>Đang tải...</Text>
            </View>
          )}
          {assets?.length > 0 && (
            <View style={{ flex: 1, padding: 16 }}>
              <FlatList
                data={assets || [{ id: "1", name: "thử nghiệm", taskCount: 1 }]}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4CD964"]} />}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      backgroundColor: "white",
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 16,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 2,
                    }}
                    onPress={() => navigation.navigate("Chi tiết kịch bản", { id: item.id })}
                  >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                      <Text style={{ fontSize: 16, fontWeight: "500", color: "#333333" }}>{item.name}</Text>
                      <ChevronRight size={20} color="#888888" />
                    </View>

                    <Text style={{ fontSize: 13, color: "#888888", marginBottom: 12 }}>{item.taskCount} tác vụ</Text>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      {/* Condition icons */}
                      {/* <View
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          backgroundColor: "#E1F5FE",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 12,
                        }}
                      >
                        <Text style={{ fontSize: 16, color: "#039BE5" }}>🌡️</Text>
                      </View>

                      <View
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          backgroundColor: "#FFF8E1",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 12,
                        }}
                      >
                        <Text style={{ fontSize: 16, color: "#FFA000" }}>☀️</Text>
                      </View>

                      <View
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          backgroundColor: "#E8F5E9",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 12,
                        }}
                      >
                        <Text style={{ fontSize: 16, color: "#43A047" }}>💬</Text>
                      </View> */}

                      <View style={{ flex: 1 }} />

                      {/* Toggle switch */}
                      <Switch
                        value={true}
                        trackColor={{ false: "#D1D1D6", true: "#4CD964" }}
                        thumbColor={"#FFFFFF"}
                        onValueChange={() => {}}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </>
      )}

      {/* Touch to Run Tab Content */}
      {activeTab === "touch" && (
        <View style={{ flex: 1, padding: 16 }}>
          <FlatList
            data={[{ id: "1", name: "Chạm để chạy mẫu", taskCount: 2 }]}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4CD964"]} />}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 40,
                  marginTop: 100,
                }}
              >
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: "#e0e0e0",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 24,
                  }}
                >
                  <Link2 size={32} color="#a0a0a0" />
                </View>
                <Text
                  style={{
                    textAlign: "center",
                    color: "#888888",
                    fontSize: 15,
                    lineHeight: 22,
                    marginBottom: 40,
                  }}
                >
                  Thực thi thủ công các tác vụ với một lần chạm
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#4CD964",
                    paddingVertical: 14,
                    paddingHorizontal: 24,
                    borderRadius: 8,
                    width: "100%",
                    alignItems: "center",
                  }}
                  onPress={() => navigation.navigate("Tạo kịch bản chạm")}
                >
                  <Text style={{ color: "white", fontWeight: "500", fontSize: 16 }}>Tạo kịch bản chạm</Text>
                </TouchableOpacity>
              </View>
            )}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  backgroundColor: "white",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                }}
                onPress={() => navigation.navigate("Chi tiết kịch bản chạm", { id: item.id })}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                  <Text style={{ fontSize: 16, fontWeight: "500", color: "#333333" }}>{item.name}</Text>
                  <ChevronRight size={20} color="#888888" />
                </View>

                <Text style={{ fontSize: 13, color: "#888888", marginBottom: 12 }}>{item.taskCount} tác vụ</Text>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: "#E8F5E9",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 12,
                    }}
                  >
                    <Text style={{ fontSize: 16, color: "#43A047" }}>💡</Text>
                  </View>

                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: "#FFF8E1",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 12,
                    }}
                  >
                    <Text style={{ fontSize: 16, color: "#FFA000" }}>🔔</Text>
                  </View>

                  <View style={{ flex: 1 }} />

                  <TouchableOpacity
                    style={{
                      backgroundColor: "#4CD964",
                      paddingVertical: 6,
                      paddingHorizontal: 16,
                      borderRadius: 16,
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "500" }}>Chạy</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  )
}

export default AutomationScreen
