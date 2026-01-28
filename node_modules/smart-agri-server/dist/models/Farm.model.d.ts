import { Model, Optional } from 'sequelize';
export type LandType = 'alluvial' | 'black' | 'red' | 'laterite' | 'desert' | 'mountain' | 'forest';
interface FarmAttributes {
    id: string;
    farmerId: string;
    name: string;
    latitude: number;
    longitude: number;
    boundary: object | null;
    areaHectares: number | null;
    landType: LandType | null;
    soilPh: number | null;
    district: string | null;
    state: string | null;
    village: string | null;
    pincode: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}
interface FarmCreationAttributes extends Optional<FarmAttributes, 'id' | 'boundary' | 'areaHectares' | 'landType' | 'soilPh' | 'district' | 'state' | 'village' | 'pincode'> {
}
declare class Farm extends Model<FarmAttributes, FarmCreationAttributes> implements FarmAttributes {
    id: string;
    farmerId: string;
    name: string;
    latitude: number;
    longitude: number;
    boundary: object | null;
    areaHectares: number | null;
    landType: LandType | null;
    soilPh: number | null;
    district: string | null;
    state: string | null;
    village: string | null;
    pincode: string | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Farm;
//# sourceMappingURL=Farm.model.d.ts.map