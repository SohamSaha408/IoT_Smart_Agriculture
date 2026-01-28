import { Model, Optional } from 'sequelize';
interface FarmerAttributes {
    id: string;
    phone: string;
    password: string;
    name: string | null;
    email: string | null;
    address: string | null;
    profileImage: string | null;
    isVerified: boolean;
    lastLoginAt: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}
interface FarmerCreationAttributes extends Optional<FarmerAttributes, 'id' | 'name' | 'email' | 'address' | 'profileImage' | 'isVerified' | 'lastLoginAt'> {
}
declare class Farmer extends Model<FarmerAttributes, FarmerCreationAttributes> implements FarmerAttributes {
    id: string;
    phone: string;
    password: string;
    name: string | null;
    email: string | null;
    address: string | null;
    profileImage: string | null;
    isVerified: boolean;
    lastLoginAt: Date | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Farmer;
//# sourceMappingURL=Farmer.model.d.ts.map