import { Model, Optional } from 'sequelize';
export type HealthStatus = 'excellent' | 'healthy' | 'moderate' | 'stressed' | 'critical';
interface CropHealthAttributes {
    id: string;
    cropId: string;
    recordedAt: Date;
    ndviValue: number | null;
    healthScore: number;
    healthStatus: HealthStatus;
    moistureLevel: number | null;
    temperature: number | null;
    rainfallMm: number | null;
    humidity: number | null;
    soilMoisture: number | null;
    recommendations: string[];
    satelliteImageUrl: string | null;
    dataSource: string;
    createdAt?: Date;
    updatedAt?: Date;
}
interface CropHealthCreationAttributes extends Optional<CropHealthAttributes, 'id' | 'recordedAt' | 'ndviValue' | 'moistureLevel' | 'temperature' | 'rainfallMm' | 'humidity' | 'soilMoisture' | 'recommendations' | 'satelliteImageUrl' | 'dataSource'> {
}
declare class CropHealth extends Model<CropHealthAttributes, CropHealthCreationAttributes> implements CropHealthAttributes {
    id: string;
    cropId: string;
    recordedAt: Date;
    ndviValue: number | null;
    healthScore: number;
    healthStatus: HealthStatus;
    moistureLevel: number | null;
    temperature: number | null;
    rainfallMm: number | null;
    humidity: number | null;
    soilMoisture: number | null;
    recommendations: string[];
    satelliteImageUrl: string | null;
    dataSource: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default CropHealth;
//# sourceMappingURL=CropHealth.model.d.ts.map