import { Model, Optional } from 'sequelize';
interface OTPAttributes {
    id: string;
    phone: string;
    otp: string;
    expiresAt: Date;
    isUsed: boolean;
    attempts: number;
    createdAt?: Date;
    updatedAt?: Date;
}
interface OTPCreationAttributes extends Optional<OTPAttributes, 'id' | 'isUsed' | 'attempts'> {
}
declare class OTP extends Model<OTPAttributes, OTPCreationAttributes> implements OTPAttributes {
    id: string;
    phone: string;
    otp: string;
    expiresAt: Date;
    isUsed: boolean;
    attempts: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    isExpired(): boolean;
    isValid(inputOtp: string): boolean;
}
export default OTP;
//# sourceMappingURL=OTP.model.d.ts.map