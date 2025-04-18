import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl } from '../utils/ApiPath';

export const getDeviceSettings = async (deviceId) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${apiUrl}/api/device/${deviceId}/setting`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `Bearer ${token}`,
            },
        });
        if(response.status === 200) {
            /*
             response.data = 
  "device": {
    "id": {
      "entityType": "DEVICE",
      "id": "8d011710-0a6c-11f0-a495-4bf785899d53"
    },
    "createdTime": 1743012178689,
    "tenantId": {
      "entityType": "TENANT",
      "id": "60e9a5b0-0211-11f0-87b6-9f1de160d4f5"
    },
    "customerId": {
      "entityType": "CUSTOMER",
      "id": "7a6d25f0-0a6a-11f0-a495-4bf785899d53"
    },
    "name": "Thiết bị 0",
    "type": "Thiết bị không khí",
    "label": null,
    "deviceProfileId": {
      "entityType": "DEVICE_PROFILE",
      "id": "ce54e910-085c-11f0-8f34-d5500402ee8a"
    },
    "firmwareId": null,
    "softwareId": null,
    "externalId": null,
    "version": 7,
    "additionalInfo": {
      "device_type": "AIR"
    },
    "deviceData": {
      "configuration": {
        "type": "DEFAULT"
      },
      "transportConfiguration": {
        "type": "DEFAULT"
      }
    }
  },
  "attributes": [
    {
      "lastUpdateTs": 1743013236821,
      "kv": {
        "key": "lightState",
        "value": false,
        "booleanValue": false,
        "valueAsString": "false",
        "dataType": "BOOLEAN",
        "doubleValue": null,
        "longValue": null,
        "jsonValue": null,
        "strValue": null
      },
      "version": 4426,
      "value": false,
      "key": "lightState",
      "doubleValue": null,
      "longValue": null,
      "booleanValue": false,
      "valueAsString": "false",
      "dataType": "BOOLEAN",
      "jsonValue": null,
      "strValue": null
    },
    {
      "lastUpdateTs": 1743187560629,
      "kv": {
        "key": "temperatureThreshold",
        "value": 40,
        "longValue": 40,
        "valueAsString": "40",
        "dataType": "LONG",
        "doubleValue": null,
        "booleanValue": null,
        "jsonValue": null,
        "strValue": null
      },
      "version": 4463,
      "value": 40,
      "key": "temperatureThreshold",
      "doubleValue": null,
      "longValue": 40,
      "booleanValue": null,
      "valueAsString": "40",
      "dataType": "LONG",
      "jsonValue": null,
      "strValue": null
    },
    {
      "lastUpdateTs": 1743187843477,
      "kv": {
        "key": "lastAlarmTime",
        "value": 1743187843477,
        "longValue": 1743187843477,
        "valueAsString": "1743187843477",
        "dataType": "LONG",
        "doubleValue": null,
        "booleanValue": null,
        "jsonValue": null,
        "strValue": null
      },
      "version": 4474,
      "value": 1743187843477,
      "key": "lastAlarmTime",
      "doubleValue": null,
      "longValue": 1743187843477,
      "booleanValue": null,
      "valueAsString": "1743187843477",
      "dataType": "LONG",
      "jsonValue": null,
      "strValue": null
    },
    {
      "lastUpdateTs": 1743187166229,
      "kv": {
        "key": "wifiPass",
        "value": "1234567899",
        "valueAsString": "1234567899",
        "dataType": "STRING",
        "strValue": "1234567899",
        "doubleValue": null,
        "longValue": null,
        "booleanValue": null,
        "jsonValue": null
      },
      "version": 4452,
      "value": "1234567899",
      "key": "wifiPass",
      "doubleValue": null,
      "longValue": null,
      "booleanValue": null,
      "valueAsString": "1234567899",
      "dataType": "STRING",
      "jsonValue": null,
      "strValue": "1234567899"
    },
    {
      "lastUpdateTs": 1743187166229,
      "kv": {
        "key": "wifiSsid",
        "value": "zunoiot",
        "valueAsString": "zunoiot",
        "dataType": "STRING",
        "strValue": "zunoiot",
        "doubleValue": null,
        "longValue": null,
        "booleanValue": null,
        "jsonValue": null
      },
      "version": 4453,
      "value": "zunoiot",
      "key": "wifiSsid",
      "doubleValue": null,
      "longValue": null,
      "booleanValue": null,
      "valueAsString": "zunoiot",
      "dataType": "STRING",
      "jsonValue": null,
      "strValue": "zunoiot"
    },
    {
      "lastUpdateTs": 1743187166229,
      "kv": {
        "key": "minCircleNotification",
        "value": "1000",
        "valueAsString": "1000",
        "dataType": "STRING",
        "strValue": "1000",
        "doubleValue": null,
        "longValue": null,
        "booleanValue": null,
        "jsonValue": null
      },
      "version": 4454,
      "value": "1000",
      "key": "minCircleNotification",
      "doubleValue": null,
      "longValue": null,
      "booleanValue": null,
      "valueAsString": "1000",
      "dataType": "STRING",
      "jsonValue": null,
      "strValue": "1000"
    },
    {
      "lastUpdateTs": 1743187166229,
      "kv": {
        "key": "minTemperature",
        "value": "20.0",
        "valueAsString": "20.0",
        "dataType": "STRING",
        "strValue": "20.0",
        "doubleValue": null,
        "longValue": null,
        "booleanValue": null,
        "jsonValue": null
      },
      "version": 4455,
      "value": "20.0",
      "key": "minTemperature",
      "doubleValue": null,
      "longValue": null,
      "booleanValue": null,
      "valueAsString": "20.0",
      "dataType": "STRING",
      "jsonValue": null,
      "strValue": "20.0"
    },
    {
      "lastUpdateTs": 1743187166229,
      "kv": {
        "key": "minHumidity",
        "value": "10.0",
        "valueAsString": "10.0",
        "dataType": "STRING",
        "strValue": "10.0",
        "doubleValue": null,
        "longValue": null,
        "booleanValue": null,
        "jsonValue": null
      },
      "version": 4457,
      "value": "10.0",
      "key": "minHumidity",
      "doubleValue": null,
      "longValue": null,
      "booleanValue": null,
      "valueAsString": "10.0",
      "dataType": "STRING",
      "jsonValue": null,
      "strValue": "10.0"
    },
    {
      "lastUpdateTs": 1743187166229,
      "kv": {
        "key": "maxTemperature",
        "value": "50.0",
        "valueAsString": "50.0",
        "dataType": "STRING",
        "strValue": "50.0",
        "doubleValue": null,
        "longValue": null,
        "booleanValue": null,
        "jsonValue": null
      },
      "version": 4459,
      "value": "50.0",
      "key": "maxTemperature",
      "doubleValue": null,
      "longValue": null,
      "booleanValue": null,
      "valueAsString": "50.0",
      "dataType": "STRING",
      "jsonValue": null,
      "strValue": "50.0"
    }
  ]
}
  convert nos sang setting lay trong device la ten con o attribute thi field va value
            */
            let deviceSettings = response.data.attributes.reduce((acc, attribute) => {
                acc[attribute.kv.key] = attribute.kv.value;
                return acc;
            }, {});
            deviceSettings.deviceId = response.data.device.id.id;
            deviceSettings.deviceName = response.data.device.name;
            deviceSettings.deviceType = response.data.device.type;
            return deviceSettings;
        }
        return null;
    } catch (error) {
        console.error('Error getting device settings:', error);
        return null;
    }
}

export const setDeviceSettings = async (deviceId, settings) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.post(`${apiUrl}/api/device/${deviceId}/setting`, settings, {
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error setting device settings:', error);
        return null;
    }
}