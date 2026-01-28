import { Model, Optional } from 'sequelize';
export type CropStatus = 'active' | 'harvested' | 'failed' | 'planned';
interface CropAttributes {
    id: string;
    farmId: string;
    cropType: string;
    variety: string | null;
    plantedDate: Date | null;
    expectedHarvestDate: Date | null;
    actualHarvestDate: Date | null;
    status: CropStatus;
    zoneBoundary: object | null;
    areaHectares: number | null;
    expectedYieldKg: number | null;
    actualYieldKg: number | null;
    notes: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}
interface CropCreationAttributes extends Optional<CropAttributes, 'id' | 'variety' | 'plantedDate' | 'expectedHarvestDate' | 'actualHarvestDate' | 'status' | 'zoneBoundary' | 'areaHectares' | 'expectedYieldKg' | 'actualYieldKg' | 'notes'> {
}
declare class Crop extends Model<CropAttributes, CropCreationAttributes> implements CropAttributes {
    id: string;
    farmId: string;
    cropType: string;
    variety: string | null;
    plantedDate: Date | null;
    expectedHarvestDate: Date | null;
    actualHarvestDate: Date | null;
    status: CropStatus;
    zoneBoundary: object | null;
    areaHectares: number | null;
    expectedYieldKg: number | null;
    actualYieldKg: number | null;
    notes: string | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Crop;
//# sourceMappingURL=Crop.model.d.ts.map