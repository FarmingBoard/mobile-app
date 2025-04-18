#include <WiFi.h>
#include <EEPROM.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

#define EEPROM_SIZE 512
#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define RESET_BUTTON_PIN 34
#define WARM_LED_DO 16
#define WARM_LED_VANG 17
#define WARM_LED_XANH 18

#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

#define LED_CONTROLL 2

/*
Status device:
Không load được dữ liệu từ EEPROM: "no_data"
Không kết nối được WiFi: "wifi_error"
Không kết nối được MQTT: "mqtt_error"
Kết nối WiFi và MQTT thành công: "connected"
*/
char *statusDevice = "";

// Khai báo các biến toàn cục
bool resetButtonPressed = false;        // Biến lưu trạng thái nút reset
unsigned long resetButtonPressTime = 0; // Biến lưu thời gian nhấn nút reset

WiFiClient espClient;
PubSubClient client(espClient);

char wifiSSID[32];
char wifiPass[64];
char mqttUser[32];
char mqttServer[32];
char *mqttPass = "";
char *mqttTopic = "v1/devices/me/telemetry";
int mqttPort = 1883;

bool wifiConnected = false;
bool mqttConnected = false;

BLECharacteristic *pCharacteristic;
BLEServer *pServer;
String rxValue = "";

void setupBLE();
bool connectToWiFi(const char *ssid, const char *password);
bool connectToMQTT();
void sendDHT11Data();
void onBLEReceive(String jsonData);
void saveCredentialsToEEPROM();
void loadCredentialsFromEEPROM();
void handleResetButton();
void resetDevice();
void callback(char *topic, byte *payload, unsigned int length);

class MyBLECallbacks : public BLECharacteristicCallbacks
{
    void onWrite(BLECharacteristic *pCharacteristic) override
    {
        String rxData = pCharacteristic->getValue().c_str();
        if (rxData.length() > 0)
        {
            Serial.println("Received credentials over BLE");
            rxValue += rxData;
            Serial.println("Received Data: " + rxValue);
            if (rxValue.indexOf(';') != -1)
            {
                onBLEReceive(rxValue);
                Serial.println("BLECALLBACK.LOG -> " + rxValue);
                rxValue = "";
            }
        }
        else
        {
            Serial.println("Received empty data");
        }
    }
};

void setup()
{
    Serial.begin(115200);
    pinMode(RESET_BUTTON_PIN, INPUT_PULLUP);
    pinMode(LED_CONTROLL, OUTPUT);
    pinMode(WARN_LED_DO, OUTPUT);
    pinMode(WARN_LED_VANG, OUTPUT);
    pinMode(WARN_LED_XANH, OUTPUT);
    client.setCallback(callback);
    dht.begin();
    EEPROM.begin(EEPROM_SIZE);
    loadCredentialsFromEEPROM();
    if (statusDevice == "no_data")
    {
        digitalWrite(WARN_LED_DO, LOW);
        digitalWrite(WARN_LED_VANG, HIGH);
        digitalWrite(WARN_LED_XANH, LOW);
        Serial.println("No data found in EEPROM");
        setupBLE();
        while (statusDevice != "connected")
        {
            delay(2000);
        }
        digitalWrite(WARN_LED_DO, LOW);
        digitalWrite(WARN_LED_VANG, LOW);
        digitalWrite(WARN_LED_XANH, HIGH);
    }
}

void loop()
{
    handleResetButton();
    if (WiFi.status() != WL_CONNECTED)
    {
        if (statusDevice != "no_connected")
        {
            digitalWrite(WARN_LED_DO, HIGH);
            digitalWrite(WARN_LED_VANG, LOW);
            digitalWrite(WARN_LED_XANH, LOW);
        }
        if (!connectToWiFi(wifiSSID, wifiPass))
            return;
    }
    if (!mqttConnected)
    {
        if (statusDevice != "no_connected")
        {
            digitalWrite(WARN_LED_DO, HIGH);
            digitalWrite(WARN_LED_VANG, LOW);
            digitalWrite(WARN_LED_XANH, LOW);
        }
        connectToMQTT();
        if (!mqttConnected)
            return;
    }
    if (WiFi.status() == WL_CONNECTED && mqttConnected == true)
    {
        sendDHT11Data();
        delay(1000);
    }
}

bool connectToWiFi(const char *ssid, const char *password)
{
    Serial.println("Connecting to WiFi...");
    WiFi.begin(ssid, password);
    unsigned long startTime = millis();
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
        if (millis() - startTime > 30000)
        {
            Serial.println("\nFailed to connect to WiFi");
            wifiConnected = false;
            statusDevice = "no_connected";
            return false;
        }
    }
    Serial.println("\nWiFi connected");
    wifiConnected = true;
    return true;
}

bool connectToMQTT()
{
    client.setServer(mqttServer, mqttPort);
    Serial.print("Connecting to MQTT...");
    if (client.connect("ESP32Client", mqttUser, mqttPass))
    {
        Serial.println("MQTT connected");
        mqttConnected = true;
        client.subscribe("v1/devices/me/attribute");
        if (statusDevice == "wifi_connected")
        {
            statusDevice = "connected";
            digitalWrite(WARN_LED_DO, LOW);
            digitalWrite(WARN_LED_VANG, LOW);
            digitalWrite(WARN_LED_XANH, HIGH);
        }
        return true;
    }
    else
    {
        Serial.print("Failed to connect to MQTT, rc=");
        Serial.println(client.state());
        mqttConnected = false;
        return false;
    }
}

void sendDHT11Data()
{
    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();
    if (isnan(humidity))
    {
        Serial.println("Failed to read from DHT11 sensor!");
        return;
    }
    String payload = "{\"humidity\": " + String(humidity) + ", \"temperature\":" + String(temperature) + "}";
    client.publish(mqttTopic, payload.c_str());
    Serial.println("Data sent to MQTT: " + payload);
}

void setupBLE()
{
    BLEDevice::init("ESP32_BLE");
    pServer = BLEDevice::createServer();
    BLEService *pService = pServer->createService(SERVICE_UUID);
    pCharacteristic = pService->createCharacteristic(
        CHARACTERISTIC_UUID,
        BLECharacteristic::PROPERTY_WRITE |
            BLECharacteristic::PROPERTY_NOTIFY);
    pCharacteristic->setCallbacks(new MyBLECallbacks());
    pService->start();
    pServer->getAdvertising()->start();
    Serial.println("BLE setup complete, waiting for credentials...");
}

void onBLEReceive(String jsonData)
{
    DynamicJsonDocument doc(512);
    DeserializationError error = deserializeJson(doc, jsonData);
    if (error)
    {
        Serial.print("Failed to parse JSON: ");
        Serial.println(error.c_str());
        return;
    }
    if (doc.containsKey("reset") && doc["reset"] == true)
    {
        Serial.println("Reset command received via BLE. Resetting device...");
        resetDevice();
        return;
    }
    strcpy(wifiSSID, doc["ssid"]);
    strcpy(wifiPass, doc["password"]);
    strcpy(mqttUser, doc["mqttUser"]);
    strcpy(mqttServer, doc["mqttServer"]);
    mqttPort = doc["mqttPort"];
    Serial.printf("onBLEReceive.LOG -> SSI: %s\n", wifiSSID);
    Serial.printf("onBLEReceive.LOG -> PASSWORD: %s\n", wifiPass);
    Serial.printf("onBLEReceive.LOG -> MQTTUSER: %s\n", mqttUser);
    Serial.printf("onBLEReceive.LOG -> MQTTSERVER: %s\n", mqttServer);
    Serial.printf("onBLERecevie.LOG -> MQTTPORT: $d\n", mqttPort);
    connectToWiFi(wifiSSID, wifiPass);
    if (wifiConnected)
    {
        connectToMQTT();
    }
    if (mqttConnected)
    {
        String message = "SUCCESS";
        pCharacteristic->setValue(message.c_str());
        pCharacteristic->notify();
        Serial.println("BLE notification sent: " + message);
    }
    saveCredentialsToEEPROM();
    statusDevice = "connected";
}

void saveCredentialsToEEPROM()
{
    EEPROM.writeString(0, wifiSSID);
    EEPROM.writeString(32, wifiPass);
    EEPROM.writeString(96, mqttUser);
    EEPROM.writeString(128, mqttServer);
    // mqttPort
    EEPROM.write(160, (uint8_t)(mqttPort >> 8));   // Byte cao
    EEPROM.write(161, (uint8_t)(mqttPort & 0xFF)); // Byte thấp

    EEPROM.commit();
    Serial.printf("SAVE_EROM.LOG -> SSI: %s\n", wifiSSID);
    Serial.printf("SAVE_EROM.LOG -> PASSWORD: %s\n", wifiPass);
    Serial.printf("SAVE_EROM.LOG -> MQTTUSER: %s\n", mqttUser);
    Serial.printf("SAVE_EROM.LOG -> MQTTSERVER: %s\n", mqttServer);
    Serial.printf("SAVE_EROM.LOAD.LOG -> MQTTPORT: %d\n", mqttPort);
    Serial.println("Credentials saved to EEPROM.");
}

void loadCredentialsFromEEPROM()
{
    EEPROM.readString(0, wifiSSID, 32);
    EEPROM.readString(32, wifiPass, 64);
    EEPROM.readString(96, mqttUser, 32);
    EEPROM.readString(128, mqttServer, 32);
    // read mqttPort
    mqttPort = (EEPROM.read(160) << 8) | EEPROM.read(161);

    Serial.printf("SAVE_EROM.LOAD.LOG -> SSI: %s\n", wifiSSID);
    Serial.printf("SAVE_EROM.LOAD.LOG -> PASSWORD: %s\n", wifiPass);
    Serial.printf("SAVE_EROM.LOAD.LOG -> MQTTUSER: %s\n", mqttUser);
    Serial.printf("SAVE_EROM.LOAD.LOG -> MQTTSERVER: %s\n", mqttServer);
    Serial.printf("SAVE_EROM.LOAD.LOG -> MQTTPORT: %d\n", mqttPort);

    if (strlen(wifiSSID) == 0 || strlen(wifiPass) == 0 || strlen(mqttUser) == 0 || strlen(mqttServer) == 0)
    {
        statusDevice = "no_data";
        Serial.println("No data found in EEPROM");
    }
    else
    {
        statusDevice = "data_found";
        Serial.println("Credentials loaded from EEPROM.");
    }
}

void handleResetButton()
{
    if (digitalRead(RESET_BUTTON_PIN) == LOW)
    {
        if (!resetButtonPressed)
        {
            resetButtonPressTime = millis();
            resetButtonPressed = true;
        }
        else if (millis() - resetButtonPressTime > 3000)
        {
            DynamicJsonDocument doc(256);
            doc["status_device"] = "REMOVE_DATA";
            String jsonMessage;
            serializeJson(doc, jsonMessage);
            client.publish("v1/devices/me/attributes", jsonMessage.c_str());
            Serial.println("Reset button held for 10 seconds. Resetting device...");
            resetDevice();
        }
    }
    else
    {
        resetButtonPressed = false;
    }
}

void resetDevice()
{
    memset(wifiSSID, 0, sizeof(wifiSSID));
    memset(wifiPass, 0, sizeof(wifiPass));
    memset(mqttUser, 0, sizeof(mqttUser));
    memset(mqttServer, 0, sizeof(mqttServer));
    mqttPort = 0;
    saveCredentialsToEEPROM();
    ESP.restart();
}

void callback(char *topic, byte *payload, unsigned int length)
{
    String message;
    for (unsigned int i = 0; i < length; i++)
    {
        message += (char)payload[i];
    }
    Serial.print("Message received: ");
    Serial.println(message);
}