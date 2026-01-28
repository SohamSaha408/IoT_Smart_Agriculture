import { Model, Optional } from 'sequelize';
export type DeviceType = 'soil_sensor' | 'water_pump' | 'valve' | 'weather_station' | 'npk_sensor';
export type DeviceStatus = 'active' | 'inactive' | 'maintenance' | 'offline';
interface IoTDeviceAttributes {
    id: string;
    farmId: string;
    deviceType: DeviceType;
    deviceId: string;
    name: string;
    latitude: number | null;
    longitude: number | null;
    status: DeviceStatus;
    firmwareVersion: string | null;
    lastSeenAt: Date | null;
    batteryLevel: number | null;
    metadata: object | null;
    createdAt?: Date;
    updatedAt?: Date;
}
interface IoTDeviceCreationAttributes extends Optional<IoTDeviceAttributes, 'id' | 'name' | 'latitude' | 'longitude' | 'status' | 'firmwareVersion' | 'lastSeenAt' | 'batteryLevel' | 'metadata'> {
}
declare class IoTDevice extends Model<IoTDeviceAttributes, IoTDeviceCreationAttributes> implements IoTDeviceAttributes {
    id: string;
    farmId: string;
    deviceType: DeviceType;
    deviceId: string;
    name: string;
    latitude: number | null;
    longitude: number | null;
    status: DeviceStatus;
    firmwareVersion: string | null;
    lastSeenAt: Date | null;
    batteryLevel: number | null;
    metadata: object | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default IoTDevice;
//# sourceMappingURL=IoTDevice.model.d.ts.map