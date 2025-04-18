import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    if (authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
        authStatus === messaging.AuthorizationStatus.PROVISIONAL) {
        console.log('Notification permission granted.');
    } else {
        console.log('Notification permission denied.');
    }
}

async function getFCMToken() {
    try {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        return token;
    } catch (error) {
        console.log('Error getting FCM token:', error);
        return null;
    }
}

function onNotificationReceived() {
    // Nhận thông báo khi app đang mở
    messaging().onMessage(async (remoteMessage) => {
        console.log('Foreground Notification:', remoteMessage);
        Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
    });

    // Nhận thông báo khi app chạy nền
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('Background Notification:', remoteMessage);
    });

    // Nhận thông báo khi app bị đóng và user bấm vào
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('User clicked notification:', remoteMessage);
    });

    // Nhận thông báo khi app mở từ trạng thái bị đóng hoàn toàn
    messaging().getInitialNotification().then(remoteMessage => {
        if (remoteMessage) {
            console.log('App opened by notification:', remoteMessage);
        }
    });
}

export { requestUserPermission, getFCMToken, onNotificationReceived };
