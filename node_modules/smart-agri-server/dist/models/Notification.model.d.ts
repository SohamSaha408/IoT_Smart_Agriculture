import { Model, Optional } from 'sequelize';
export type NotificationType = 'irrigation' | 'fertilization' | 'health_alert' | 'weather' | 'device' | 'system';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';
export type NotificationChannel = 'in_app' | 'sms' | 'email';
interface NotificationAttributes {
    id: string;
    farmerId: string;
    farmId: string | null;
    cropId: string | null;
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    message: string;
    channels: NotificationChannel[];
    sentVia: NotificationChannel[];
    readAt: Date | null;
    actionUrl: string | null;
    metadata: object | null;
    createdAt?: Date;
    updatedAt?: Date;
}
interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id' | 'farmId' | 'cropId' | 'priority' | 'channels' | 'sentVia' | 'readAt' | 'actionUrl' | 'metadata'> {
}
declare class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
    id: string;
    farmerId: string;
    farmId: string | null;
    cropId: string | null;
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    message: string;
    channels: NotificationChannel[];
    sentVia: NotificationChannel[];
    readAt: Date | null;
    actionUrl: string | null;
    metadata: object | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Notification;
//# sourceMappingURL=Notification.model.d.ts.map