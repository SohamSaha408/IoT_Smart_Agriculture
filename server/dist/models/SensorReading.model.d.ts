import { Model, Optional } from 'sequelize';
interface SensorReadingAttributes {
    id: string;
    deviceId: string;
    recordedAt: Date;
    soilMoisture: number | null;
    soilTemperature: number | null;
    soilPh: number | null;
    nitrogenLevel: number | null;
    phosphorusLevel: number | null;
    potassiumLevel: number | null;
    airTemperature: number | null;
    airHumidity: number | null;
    lightIntensity: number | null;
    rawData: object | null;
    createdAt?: Date;
    updatedAt?: Date;
}
interface SensorReadingCreationAttributes extends Optional<SensorReadingAttributes, 'id' | 'recordedAt' | 'soilMoisture' | 'soilTemperature' | 'soilPh' | 'nitrogenLevel' | 'phosphorusLevel' | 'potassiumLevel' | 'airTemperature' | 'airHumidity' | 'lightIntensity' | 'rawData'> {
}
declare class SensorReading extends Model<SensorReadingAttributes, SensorReadingCreationAttributes> implements SensorReadingAttributes {
    id: string;
    deviceId: string;
    recordedAt: Date;
    soilMoisture: number | null;
    soilTemperature: number | null;
    soilPh: number | null;
    nitrogenLevel: number | null;
    phosphorusLevel: number | null;
    potassiumLevel: number | null;
    airTemperature: number | null;
    airHumidity: number | null;
    lightIntensity: number | null;
    rawData: object | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default SensorReading;
//# sourceMappingURL=SensorReading.model.d.ts.map