# ESP32 Smart Agriculture IoT Device

## Hardware Requirements

### Main Controller
- **ESP32 DevKit V1** or ESP32-WROOM-32

### Sensors
| Component | Model | Purpose | Price (INR) |
|-----------|-------|---------|-------------|
| Soil Moisture Sensor | Capacitive v1.2 | Measures soil moisture | ~150 |
| Soil Temperature | DS18B20 (Waterproof) | Soil temperature | ~100 |
| Air Temp/Humidity | DHT22 | Ambient conditions | ~250 |
| NPK Sensor | RS485 NPK Sensor | Soil nutrients (optional) | ~2500 |

### Actuators
| Component | Model | Purpose | Price (INR) |
|-----------|-------|---------|-------------|
| Relay Module | 4-Channel 5V | Control pump/valve | ~200 |
| Water Pump | 12V DC Submersible | Irrigation | ~500 |
| Solenoid Valve | 12V NC | Water flow control | ~350 |
| Water Flow Sensor | YF-S201 | Measure water usage | ~200 |

### Power Supply
- 12V 2A DC Adapter
- LM2596 Buck Converter (12V to 5V for ESP32)

## Wiring Diagram

```
                    ESP32 DevKit V1
                    +--------------+
                    |              |
    Soil Moisture --|GPIO34        |
       (Analog)     |              |
                    |         GPIO4|-- DS18B20 (OneWire)
                    |              |     |
                    |         GPIO5|-- DHT22
                    |              |
                    |        GPIO16|-- Relay 1 (Pump)
                    |        GPIO17|-- Relay 2 (Valve)
                    |        GPIO18|-- Water Flow Sensor
                    |              |
                    |          3V3 |-- Sensor VCC
                    |          GND |-- Common Ground
                    |          VIN |-- 5V (from Buck Converter)
                    +--------------+

Relay Module:
    VCC -> 5V
    GND -> GND
    IN1 -> GPIO16
    IN2 -> GPIO17
    COM -> 12V+
    NO  -> Pump/Valve +
    
Pump/Valve:
    + -> Relay NO
    - -> 12V GND
```

## Setup Instructions

### 1. Install PlatformIO
```bash
# Install VS Code extension: PlatformIO IDE
# Or install CLI:
pip install platformio
```

### 2. Configure WiFi and MQTT
Edit `main.cpp` and update:
```cpp
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
const char* MQTT_SERVER = "YOUR_SERVER_IP";
```

### 3. Build and Upload
```bash
cd iot/firmware
pio run --target upload
```

### 4. Monitor Serial Output
```bash
pio device monitor
```

## MQTT Topics

### Published by Device
- `smart-agri/sensors/{DEVICE_ID}/data` - Sensor readings
- `smart-agri/devices/{DEVICE_ID}/status` - Device status
- `smart-agri/irrigation/{DEVICE_ID}/ack` - Irrigation completion

### Subscribed by Device
- `smart-agri/irrigation/{DEVICE_ID}/command` - Irrigation commands

## Data Format

### Sensor Data
```json
{
  "deviceId": "AABBCCDDEEFF",
  "timestamp": 123456789,
  "soilMoisture": 45.5,
  "soilTemperature": 25.3,
  "airTemperature": 28.1,
  "airHumidity": 65.2
}
```

### Irrigation Command
```json
{
  "action": "start",
  "durationMinutes": 30,
  "scheduleId": "uuid-xxx"
}
```

### Irrigation Acknowledgment
```json
{
  "scheduleId": "uuid-xxx",
  "status": "completed",
  "actualDuration": 1800,
  "waterVolume": 150.5
}
```

## Calibration

### Soil Moisture Sensor
1. Insert sensor in dry soil, note the ADC value (~4095)
2. Insert sensor in wet soil, note the ADC value (~1500)
3. Update values in `main.cpp`:
```cpp
#define SOIL_MOISTURE_DRY 4095
#define SOIL_MOISTURE_WET 1500
```

## Troubleshooting

### WiFi Connection Issues
- Check SSID and password
- Ensure 2.4GHz network (ESP32 doesn't support 5GHz)
- Check signal strength (RSSI > -70 dBm recommended)

### MQTT Connection Issues
- Verify server IP and port
- Check MQTT credentials
- Ensure firewall allows port 1883

### Sensor Reading Issues
- Check wiring connections
- Verify sensor power supply (3.3V or 5V as required)
- Test sensors individually

## Power Consumption
- Normal operation: ~80mA @ 5V
- WiFi active: ~120mA @ 5V
- Deep sleep: ~10μA (for battery operation)

## Future Enhancements
- OTA (Over-The-Air) firmware updates
- Deep sleep mode for battery operation
- LoRa support for long-range communication
- Solar power integration
