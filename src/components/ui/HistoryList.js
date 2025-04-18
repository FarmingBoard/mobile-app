import { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, ActivityIndicator, FlatList, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ipHost } from "../../utils/ApiPath";

const processDataForList = (data, keys) => {
    const timestampMap = new Map();

    keys.attribute.forEach((attr) => {
        if (data[attr.field]) {
            data[attr.field].forEach((item) => {
                if (!timestampMap.has(item.ts)) {
                    timestampMap.set(item.ts, {
                        timestamp: item.ts,
                        [attr.field]: item.value,
                    });
                } else {
                    timestampMap.get(item.ts)[attr.field] = item.value;
                }
            });
        }
    });

    return Array.from(timestampMap.values())
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 20);
};

const HistoryList = ({ deviceId, keys }) => {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentLimit, setCurrentLimit] = useState(10);

    const params = useMemo(() => {
        const endTime = Date.now();
        return {
            keys: keys.attribute.map((attr) => attr.field).join(",") || "",
            startTs: 0,
            endTs: endTime,
            interval: 0,
            limit: currentLimit,
            agg: "NONE",
            orderBy: "DESC",
            useStrictDataTypes: false,
        };
    }, [keys, currentLimit]);

    useEffect(() => {
        const fetchHistoricalData = async () => {
            try {
                setLoading(true);
                const token = await AsyncStorage.getItem("token");
                if (!token) {
                    throw new Error("Token not found");
                }

                const queryString = Object.entries(params)
                    .map(([key, value]) => `${key}=${value}`)
                    .join("&");

                const url = `http://${ipHost}:8080/api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries?${queryString}`;

                const response = await fetch(url, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch historical data");
                }

                const data = await response.json();
                const processedData = processDataForList(data, keys);
                setHistoryData(processedData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHistoricalData();
    }, [deviceId, params, keys]);

    const handleShowMore = useCallback(() => {
        setCurrentLimit((prev) => prev + 10);
    }, []);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    const renderItem = ({ item }) => (
        <View className="flex-row py-3 border-b border-gray-100">
            <View className="flex-1">
                <Text className="text-xs text-gray-500">{formatDate(item.timestamp)}</Text>
            </View>
            <View className="flex-row flex-1 justify-between">
                {keys.attribute.map((attr, index) => (
                    <Text key={index} className={`text-sm text-gray-800 ${index !== keys.attribute.length - 1 ? "mr-4" : ""}`}>
                        {item[attr.field]}
                    </Text>
                ))}
            </View>
        </View>
    );

    const renderHeader = () => (
        <View className="flex-row py-2 border-b border-gray-200 bg-gray-50">
            <View className="flex-1">
                <Text className="text-xs font-medium text-gray-500">Thời gian</Text>
            </View>
            <View className="flex-row flex-1 justify-between">
                {keys.attribute.map((attr, index) => (
                    <Text key={index} className={`text-xs font-medium text-gray-500 ${index !== keys.attribute.length - 1 ? "mr-4" : ""}`}>
                        {attr.name}
                    </Text>
                ))}
            </View>
        </View>
    );

    if (loading) {
        return (
            <View className="h-40 items-center justify-center">
                <ActivityIndicator size="large" color="#059669" />
                <Text className="mt-2 text-gray-600">Đang tải dữ liệu...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="h-40 items-center justify-center">
                <Text className="text-red-500">Lỗi: {error}</Text>
            </View>
        );
    }

    if (!historyData || historyData.length === 0) {
        return (
            <View className="h-40 items-center justify-center">
                <Text className="text-gray-600">Không có dữ liệu lịch sử</Text>
            </View>
        );
    }

    return (
        <View>
            <View className="p-3">
                <Text className="text-base font-medium text-gray-800 mb-2">Lịch sử dữ liệu</Text>
                {renderHeader()}
                <ScrollView className="h-[400px]">
                    <FlatList data={historyData} renderItem={renderItem} keyExtractor={(item) => item.timestamp.toString()} scrollEnabled={false} />
                    <TouchableOpacity onPress={handleShowMore} className="py-2 items-center rounded-md">
                        <Text className="text-green-700 font-medium">Hiển thị thêm 10 hàng</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
};

export default HistoryList;
