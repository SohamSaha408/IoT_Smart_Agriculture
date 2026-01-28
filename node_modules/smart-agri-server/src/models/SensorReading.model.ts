import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface SensorReadingAttributes {
  id: string;
  deviceId: string;
  recordedAt: Date;
  soilMoisture: number | null;
  soilTemperature: number | null;
  soilPh: number | null;
  nitrogenLevel: number | null;
  phosphorusLevel: number | null;
  potassiumLevel: number | null;
  airTemperature: number | null;
  airHumidity: number | null;
  lightIntensity: number | null;
  rawData: object | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SensorReadingCreationAttributes extends Optional<SensorReadingAttributes, 'id' | 'recordedAt' | 'soilMoisture' | 'soilTemperature' | 'soilPh' | 'nitrogenLevel' | 'phosphorusLevel' | 'potassiumLevel' | 'airTemperature' | 'airHumidity' | 'lightIntensity' | 'rawData'> {}

class SensorReading extends Model<SensorReadingAttributes, SensorReadingCreationAttributes> implements SensorReadingAttributes {
  public id!: string;
  public deviceId!: string;
  public recordedAt!: Date;
  public soilMoisture!: number | null;
  public soilTemperature!: number | null;
  public soilPh!: number | null;
  public nitrogenLevel!: number | null;
  public phosphorusLevel!: number | null;
  public potassiumLevel!: number | null;
  public airTemperature!: number | null;
  public airHumidity!: number | null;
  public lightIntensity!: number | null;
  public rawData!: object | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SensorReading.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    deviceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'iot_devices',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    recordedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    soilMoisture: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Soil moisture percentage (0-100)'
    },
    soilTemperature: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: true,
      comment: 'Soil temperature in Celsius'
    },
    soilPh: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
      validate: {
        min: 0,
        max: 14
      }
    },
    nitrogenLevel: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true,
      comment: 'Nitrogen (N) level in mg/kg'
    },
    phosphorusLevel: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true,
      comment: 'Phosphorus (P) level in mg/kg'
    },
    potassiumLevel: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true,
      comment: 'Potassium (K) level in mg/kg'
    },
    airTemperature: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: true,
      comment: 'Air temperature in Celsius'
    },
    airHumidity: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Air humidity percentage'
    },
    lightIntensity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Light intensity in lux'
    },
    rawData: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Raw sensor data from device'
    }
  },
  {
    sequelize,
    tableName: 'sensor_readings',
    modelName: 'SensorReading',
    indexes: [
      {
        fields: ['device_id']
      },
      {
        fields: ['recorded_at']
      }
    ]
  }
);

export default SensorReading;
