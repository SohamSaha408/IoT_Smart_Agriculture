import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export type FertilizationStatus = 'recommended' | 'scheduled' | 'applied' | 'skipped';

interface FertilizationRecordAttributes {
  id: string;
  cropId: string;
  recommendedDate: Date;
  fertilzerType: string;
  quantityKg: number;
  npkRatio: string | null;
  status: FertilizationStatus;
  appliedAt: Date | null;
  actualQuantityKg: number | null;
  applicationMethod: string | null;
  costEstimate: number | null;
  actualCost: number | null;
  notes: string | null;
  basedOnSoilAnalysis: boolean;
  soilAnalysisData: object | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface FertilizationRecordCreationAttributes extends Optional<FertilizationRecordAttributes, 'id' | 'npkRatio' | 'status' | 'appliedAt' | 'actualQuantityKg' | 'applicationMethod' | 'costEstimate' | 'actualCost' | 'notes' | 'basedOnSoilAnalysis' | 'soilAnalysisData'> {}

class FertilizationRecord extends Model<FertilizationRecordAttributes, FertilizationRecordCreationAttributes> implements FertilizationRecordAttributes {
  public id!: string;
  public cropId!: string;
  public recommendedDate!: Date;
  public fertilzerType!: string;
  public quantityKg!: number;
  public npkRatio!: string | null;
  public status!: FertilizationStatus;
  public appliedAt!: Date | null;
  public actualQuantityKg!: number | null;
  public applicationMethod!: string | null;
  public costEstimate!: number | null;
  public actualCost!: number | null;
  public notes!: string | null;
  public basedOnSoilAnalysis!: boolean;
  public soilAnalysisData!: object | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FertilizationRecord.init(
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
    recommendedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fertilzerType: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    quantityKg: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    npkRatio: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'NPK ratio e.g., 10:26:26'
    },
    status: {
      type: DataTypes.ENUM('recommended', 'scheduled', 'applied', 'skipped'),
      defaultValue: 'recommended',
    },
    appliedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    actualQuantityKg: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
    },
    applicationMethod: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'broadcasting, foliar, drip, etc.'
    },
    costEstimate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Estimated cost in INR'
    },
    actualCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Actual cost in INR'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    basedOnSoilAnalysis: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    soilAnalysisData: {
      type: DataTypes.JSONB,
      allowNull: true,
    }
  },
  {
    sequelize,
    tableName: 'fertilization_records',
    modelName: 'FertilizationRecord',
    indexes: [
      {
        fields: ['crop_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['recommended_date']
      }
    ]
  }
);

export default FertilizationRecord;
