import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

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

interface FarmerCreationAttributes extends Optional<FarmerAttributes, 'id' | 'name' | 'email' | 'address' | 'profileImage' | 'isVerified' | 'lastLoginAt'> {}

class Farmer extends Model<FarmerAttributes, FarmerCreationAttributes> implements FarmerAttributes {
  public id!: string;
  public phone!: string;
  public password!: string;
  public name!: string | null;
  public email!: string | null;
  public address!: string | null;
  public profileImage!: string | null;
  public isVerified!: boolean;
  public lastLoginAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Farmer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[+]?[0-9]{10,15}$/
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profileImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  },
  {
    sequelize,
    tableName: 'farmers',
    modelName: 'Farmer',
  }
);

export default Farmer;
