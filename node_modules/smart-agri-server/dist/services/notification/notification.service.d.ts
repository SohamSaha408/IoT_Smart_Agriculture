import { Notification } from '../../models';
interface CreateNotificationParams {
    farmerId: string;
    farmId?: string | null;
    cropId?: string | null;
    type: 'irrigation' | 'fertilization' | 'health_alert' | 'weather' | 'device' | 'system';
    priority?: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    channels?: ('in_app' | 'sms' | 'email')[];
    actionUrl?: string;
    metadata?: object;
}
export declare const createNotification: (params: CreateNotificationParams) => Promise<Notification>;
export declare const createCriticalAlert: (farmerId: string, farmId: string, type: CreateNotificationParams["type"], title: string, message: string, metadata?: object) => Promise<Notification>;
export declare const getNotifications: (farmerId: string, options?: {
    unreadOnly?: boolean;
    type?: string;
    limit?: number;
    offset?: number;
}) => Promise<{
    notifications: Notification[];
    total: number;
    unreadCount: number;
}>;
export declare const markAsRead: (notificationId: string, farmerId: string) => Promise<boolean>;
export declare const markAllAsRead: (farmerId: string) => Promise<number>;
export declare const cleanupOldNotifications: (daysOld?: number) => Promise<number>;
export declare const createSystemNotification: (title: string, message: string) => Promise<number>;
export {};
//# sourceMappingURL=notification.service.d.ts.map