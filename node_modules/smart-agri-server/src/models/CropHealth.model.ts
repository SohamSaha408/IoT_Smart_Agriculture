import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export type HealthStatus = 'excellent' | 'healthy' | 'moderate' | 'stressed' | 'critical';

interface CropHealthAttributes {
  id: string;
  cropId: string;
  recordedAt: Date;
  ndviValue: number | null;
  healthScore: number;
  healthStatus: HealthStatus;
  moistureLevel: number | null;
  temperature: number | null;
  rainfallMm: number | null;
  humidity: number | null;
  soilMoisture: number | null;
  recommendations: string[];
  satelliteImageUrl: string | null;
  dataSource: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CropHealthCreationAttributes extends Optional<CropHealthAttributes, 'id' | 'recordedAt' | 'ndviValue' | 'moistureLevel' | 'temperature' | 'rainfallMm' | 'humidity' | 'soilMoisture' | 'recommendations' | 'satelliteImageUrl' | 'dataSource'> {}

class CropHealth extends Model<CropHealthAttributes, CropHealthCreationAttributes> implements CropHealthAttributes {
  public id!: string;
  public cropId!: string;
  public recordedAt!: Date;
  public ndviValue!: number | null;
  public healthScore!: number;
  public healthStatus!: HealthStatus;
  public moistureLevel!: number | null;
  public temperature!: number | null;
  public rainfallMm!: number | null;
  public humidity!: number | null;
  public soilMoisture!: number | null;
  public recommendations!: string[];
  public satelliteImageUrl!: string | null;
  public dataSource!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CropHealth.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    cropId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'crops',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    recordedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    ndviValue: {
      type: DataTypes.DECIMAL(4, 3),
      allowNull: true,
      validate: {
        min: -1,
        max: 1
      },
      comment: 'Normalized Difference Vegetation Index (-1 to 1)'
    },
    healthScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      },
      comment: 'Overall health score (0-100)'
    },
    healthStatus: {
      type: DataTypes.ENUM('excellent', 'healthy', 'moderate', 'stressed', 'critical'),
      allowNull: false,
    },
    moistureLevel: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Percentage moisture level'
    },
    temperature: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: true,
      comment: 'Temperature in Celsius'
    },
    rainfallMm: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true,
      comment: 'Rainfall in millimeters'
    },
    humidity: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Relative humidity percentage'
    },
    soilMoisture: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Soil moisture from sensors'
    },
    recommendations: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: [],
      comment: 'AI-generated recommendations'
    },
    satelliteImageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    dataSource: {
      type: DataTypes.STRING(50),
      defaultValue: 'agromonitoring',
      comment: 'Source of satellite data'
    }
  },
  {
    sequelize,
    tableName: 'crop_health',
    modelName: 'CropHealth',
    indexes: [
      {
        fields: ['crop_id']
      },
      {
        fields: ['recorded_at']
      },
      {
        fields: ['health_status']
      }
    ]
  }
);

export default CropHealth;
