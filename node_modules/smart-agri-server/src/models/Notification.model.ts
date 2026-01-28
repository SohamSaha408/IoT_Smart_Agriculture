import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

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

interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id' | 'farmId' | 'cropId' | 'priority' | 'channels' | 'sentVia' | 'readAt' | 'actionUrl' | 'metadata'> {}

class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public id!: string;
  public farmerId!: string;
  public farmId!: string | null;
  public cropId!: string | null;
  public type!: NotificationType;
  public priority!: NotificationPriority;
  public title!: string;
  public message!: string;
  public channels!: NotificationChannel[];
  public sentVia!: NotificationChannel[];
  public readAt!: Date | null;
  public actionUrl!: string | null;
  public metadata!: object | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    farmerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'farmers',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    farmId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'farms',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    cropId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'crops',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    type: {
      type: DataTypes.ENUM('irrigation', 'fertilization', 'health_alert', 'weather', 'device', 'system'),
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      defaultValue: 'medium',
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    channels: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: ['in_app'],
      comment: 'Requested notification channels'
    },
    sentVia: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      comment: 'Channels through which notification was sent'
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    actionUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL to navigate when notification is clicked'
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    }
  },
  {
    sequelize,
    tableName: 'notifications',
    modelName: 'Notification',
    indexes: [
      {
        fields: ['farmer_id']
      },
      {
        fields: ['type']
      },
      {
        fields: ['priority']
      },
      {
        fields: ['read_at']
      },
      {
        fields: ['created_at']
      }
    ]
  }
);

export default Notification;
