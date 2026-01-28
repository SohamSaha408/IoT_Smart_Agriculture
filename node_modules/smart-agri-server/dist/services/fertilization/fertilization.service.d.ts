import { Crop, CropHealth, FertilizationRecord, SensorReading } from '../../models';
interface FertilizationRecommendation {
    cropId: string;
    cropType: string;
    fertilizerType: string;
    quantityKg: number;
    npkRatio: string;
    urgency: 'low' | 'medium' | 'high';
    reason: string;
    estimatedCost: number;
    growthStage: string;
}
export declare const calculateFertilizationNeed: (crop: Crop, sensorData: SensorReading | null, latestHealth: CropHealth | null) => Promise<FertilizationRecommendation | null>;
export declare const getFertilizationRecommendations: (farmId: string, farmerId: string) => Promise<FertilizationRecommendation[]>;
export declare const createFertilizationRecord: (cropId: string, fertilizerType: string, quantityKg: number, npkRatio: string, recommendedDate: Date, costEstimate: number) => Promise<FertilizationRecord>;
export declare const markAsApplied: (recordId: string, actualQuantityKg: number, actualCost: number, applicationMethod: string, notes?: string) => Promise<FertilizationRecord | null>;
export {};
//# sourceMappingURL=fertilization.service.d.ts.map