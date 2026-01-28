import { IoTDevice, SensorReading } from '../../models';
export declare const storeSensorReading: (deviceId: string, data: {
    soilMoisture?: number;
    soilTemperature?: number;
    soilPh?: number;
    nitrogenLevel?: number;
    phosphorusLevel?: number;
    potassiumLevel?: number;
    airTemperature?: number;
    airHumidity?: number;
    lightIntensity?: number;
}) => Promise<SensorReading | null>;
export declare const updateDeviceStatus: (deviceId: string, status: "active" | "inactive" | "maintenance" | "offline") => Promise<boolean>;
export declare const registerDevice: (farmId: string, deviceId: string, deviceType: "soil_sensor" | "water_pump" | "valve" | "weather_station" | "npk_sensor", name?: string, latitude?: number, longitude?: number) => Promise<IoTDevice | null>;
export declare const getLatestReadings: (deviceId: string, limit?: number) => Promise<SensorReading[]>;
export declare const getDeviceStats: (deviceId: string, hours?: number) => Promise<{
    avgSoilMoisture: number | null;
    avgTemperature: number | null;
    readingCount: number;
    lastReading: Date | null;
}>;
//# sourceMappingURL=iot.service.d.ts.map