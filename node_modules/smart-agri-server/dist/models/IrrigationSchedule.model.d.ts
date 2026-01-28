import { Model, Optional } from 'sequelize';
export type IrrigationStatus = 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
export type IrrigationTrigger = 'manual' | 'auto' | 'schedule' | 'sensor';
interface IrrigationScheduleAttributes {
    id: string;
    farmId: string;
    cropId: string | null;
    deviceId: string | null;
    scheduledTime: Date;
    durationMinutes: number;
    waterVolumeLiters: number | null;
    status: IrrigationStatus;
    triggeredBy: IrrigationTrigger;
    executedAt: Date | null;
    completedAt: Date | null;
    actualVolumeLiters: number | null;
    notes: string | null;
    weatherCondition: object | null;
    createdAt?: Date;
    updatedAt?: Date;
}
interface IrrigationScheduleCreationAttributes extends Optional<IrrigationScheduleAttributes, 'id' | 'cropId' | 'deviceId' | 'waterVolumeLiters' | 'status' | 'executedAt' | 'completedAt' | 'actualVolumeLiters' | 'notes' | 'weatherCondition'> {
}
declare class IrrigationSchedule extends Model<IrrigationScheduleAttributes, IrrigationScheduleCreationAttributes> implements IrrigationScheduleAttributes {
    id: string;
    farmId: string;
    cropId: string | null;
    deviceId: string | null;
    scheduledTime: Date;
    durationMinutes: number;
    waterVolumeLiters: number | null;
    status: IrrigationStatus;
    triggeredBy: IrrigationTrigger;
    executedAt: Date | null;
    completedAt: Date | null;
    actualVolumeLiters: number | null;
    notes: string | null;
    weatherCondition: object | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default IrrigationSchedule;
//# sourceMappingURL=IrrigationSchedule.model.d.ts.map