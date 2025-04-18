import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { apiUrl } from "../utils/ApiPath";

export default async function getTokenWithRefreshToken(params) {
    try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        const response = await axios.post(
            `${apiUrl}/api/auth/token`,
            {
                refreshToken: refreshToken,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const data = response.data;

        if(response.status === 200) {
            // Lưu token mới vào AsyncStorage
            await AsyncStorage.setItem("token", data.token);
            await AsyncStorage.setItem("refreshToken", data.refreshToken);
            return true; // Trả về token mới
        }
        else {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("refreshToken");
            console.log("Token không hợp lệ hoặc đã hết hạn.");
            return false;
        }

    } catch (error) {
        console.error('Error in getTokenWithRefreshToken:', error);
        return false;
    }
}