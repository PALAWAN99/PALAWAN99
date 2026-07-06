#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <TinyGPS++.h>
#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <UniversalTelegramBot.h>

// --- ข้อมูล WiFi และ Telegram ---
const char* ssid = "CASTORICE";
const char* password = "1122334466";
#define BOTtoken "8470136207:AAHLaKVhTVhaUcqHTwwnrbjQUUvxu-nwei0"
#define CHAT_ID "8550771226"

const int COMMON_TRIG = D5; 
const int US1_ECHO    = D1;
const int US2_ECHO    = D2;
const int GPS_RX_PIN  = D6; 
const int IR_PIN      = D7;
const int BUZZER      = D0; 
const int MOTOR_PIN   = D8; 

Adafruit_MPU6050 mpu;
TinyGPSPlus gps;
SoftwareSerial gpsSerial(GPS_RX_PIN, -1);
WiFiClientSecure client;
UniversalTelegramBot bot(BOTtoken, client);

bool mpuReady = false;
unsigned long fallStartTime = 0;
bool isFallen = false;
unsigned long lastTelegramTime = 0;
const unsigned long telegramInterval = 30000; 
unsigned long lastSerialPrint = 0; // สำหรับคุมความเร็วหน้าจอ Serial

void setup() {
  Serial.begin(115200); // ** อย่าลืมปรับใน Serial Monitor เป็น 115200 **
  gpsSerial.begin(9600);
  
  pinMode(COMMON_TRIG, OUTPUT);
  pinMode(US1_ECHO, INPUT);
  pinMode(US2_ECHO, INPUT);
  pinMode(IR_PIN, INPUT);
  pinMode(BUZZER, OUTPUT);
  pinMode(MOTOR_PIN, OUTPUT);
  
  digitalWrite(BUZZER, HIGH);   
  digitalWrite(MOTOR_PIN, LOW); 

  Serial.println("\n\nConnecting to WiFi...");
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  client.setInsecure(); 

  Wire.begin(D4, D3); 
  if (mpu.begin()) {
    mpuReady = true;
    mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
    Serial.println("MPU6050 Ready!");
  } else {
    Serial.println("MPU6050 Failed! Check D3/D4");
  }
}

void loop() {
  // --- 1. อ่าน GPS ---
  while (gpsSerial.available() > 0) {
    gps.encode(gpsSerial.read());
  }

  // --- 2. อ่าน Sensors ---
  int dist1 = readStableDistance(US1_ECHO);
  int dist2 = readStableDistance(US2_ECHO);
  int irVal = digitalRead(IR_PIN);
  float accelY = 0, tiltAngle = 0;

  if (mpuReady) {
    sensors_event_t a, g, temp;
    mpu.getEvent(&a, &g, &temp);
    accelY = a.acceleration.y;
    
    // คำนวณองศาการเอียงคร่าวๆ (90 คือตั้งตรง, 0 คือแนวนอน)
    tiltAngle = atan2(a.acceleration.y, a.acceleration.z) * 180 / PI;

    if (abs(accelY) < 4.0) { 
       if (fallStartTime == 0) fallStartTime = millis();
       else if (millis() - fallStartTime > 2000) isFallen = true;
    } else {
       fallStartTime = 0;
       isFallen = false;
    }
  }

  // --- 3. แสดงผลบน Serial Monitor (ทุกๆ 500ms) ---
  if (millis() - lastSerialPrint > 500) {
    Serial.println("------------------------------------");
    Serial.print("WiFi: "); Serial.print(WiFi.status() == WL_CONNECTED ? "CONNECTED" : "DISCONNECTED");
    Serial.print(" | GPS Sat: "); Serial.println(gps.satellites.value());
    
    if (gps.location.isValid()) {
      Serial.print("Location: "); Serial.print(gps.location.lat(), 6); 
      Serial.print(","); Serial.println(gps.location.lng(), 6);
    }

    Serial.print("U1: "); Serial.print(dist1); Serial.print("cm");
    Serial.print(" | U2: "); Serial.print(dist2); Serial.print("cm");
    Serial.print(" | IR: "); Serial.println(irVal == HIGH ? "HOLE!" : "Ground OK");

    Serial.print("Tilt: "); Serial.print(tiltAngle); Serial.print(" deg");
    Serial.print(" | Status: "); Serial.println(isFallen ? "!!! FALLEN !!!" : "NORMAL");
    
    lastSerialPrint = millis();
  }

  // --- 4. ระบบแจ้งเตือน (Alert Logic) ---
  bool obstacle = (dist1 > 0 && dist1 < 50) || (dist2 > 0 && dist2 < 50);
  bool hole = (irVal == HIGH); 

  if (isFallen) {
    digitalWrite(BUZZER, LOW); digitalWrite(MOTOR_PIN, HIGH);
    delay(100); digitalWrite(BUZZER, HIGH); delay(100);
    
    if (WiFi.status() == WL_CONNECTED && (millis() - lastTelegramTime > telegramInterval)) {
      String message = "⚠️ ตรวจพบคนล้ม!\n";
      if (gps.location.isValid()) {
        message += "พิกัด: https://www.google.com/maps?q=" + String(gps.location.lat(), 6) + "," + String(gps.location.lng(), 6);
      } else {
        message += "ไม่สามารถระบุพิกัด GPS ได้";
      }
      if (bot.sendMessage(CHAT_ID, message, "")) {
        lastTelegramTime = millis();
        Serial.println(">>> Telegram Alert Sent! <<<");
      }
    }
  } 
  else if (obstacle || hole) {
    digitalWrite(BUZZER, LOW); digitalWrite(MOTOR_PIN, HIGH);
  } 
  else {
    digitalWrite(BUZZER, HIGH); digitalWrite(MOTOR_PIN, LOW);
  }
}

int readStableDistance(int echoPin) {
  digitalWrite(COMMON_TRIG, LOW); delayMicroseconds(2);
  digitalWrite(COMMON_TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(COMMON_TRIG, LOW);
  long duration = pulseIn(echoPin, HIGH, 25000);
  if(duration <= 0) return 0;
  return duration / 58.2;
}    
