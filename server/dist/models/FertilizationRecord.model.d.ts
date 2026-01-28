import { Model, Optional } from 'sequelize';
export type FertilizationStatus = 'recommended' | 'scheduled' | 'applied' | 'skipped';
interface FertilizationRecordAttributes {
    id: string;
    cropId: string;
    recommendedDate: Date;
    fertilzerType: string;
    quantityKg: number;
    npkRatio: string | null;
    status: FertilizationStatus;
    appliedAt: Date | null;
    actualQuantityKg: number | null;
    applicationMethod: string | null;
    costEstimate: number | null;
    actualCost: number | null;
    notes: string | null;
    basedOnSoilAnalysis: boolean;
    soilAnalysisData: object | null;
    createdAt?: Date;
    updatedAt?: Date;
}
interface FertilizationRecordCreationAttributes extends Optional<FertilizationRecordAttributes, 'id' | 'npkRatio' | 'status' | 'appliedAt' | 'actualQuantityKg' | 'applicationMethod' | 'costEstimate' | 'actualCost' | 'notes' | 'basedOnSoilAnalysis' | 'soilAnalysisData'> {
}
declare class FertilizationRecord extends Model<FertilizationRecordAttributes, FertilizationRecordCreationAttributes> implements FertilizationRecordAttributes {
    id: string;
    cropId: string;
    recommendedDate: Date;
    fertilzerType: string;
    quantityKg: number;
    npkRatio: string | null;
    status: FertilizationStatus;
    appliedAt: Date | null;
    actualQuantityKg: number | null;
    applicationMethod: string | null;
    costEstimate: number | null;
    actualCost: number | null;
    notes: string | null;
    basedOnSoilAnalysis: boolean;
    soilAnalysisData: object | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default FertilizationRecord;
//# sourceMappingURL=FertilizationRecord.model.d.ts.map