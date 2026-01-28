import Farmer from './Farmer.model';
import OTP from './OTP.model';
import Farm from './Farm.model';
import Crop from './Crop.model';
import CropHealth from './CropHealth.model';
import IoTDevice from './IoTDevice.model';
import SensorReading from './SensorReading.model';
import IrrigationSchedule from './IrrigationSchedule.model';
import FertilizationRecord from './FertilizationRecord.model';
import Notification from './Notification.model';

// Define associations
// Farmer -> Farm (One-to-Many)
Farmer.hasMany(Farm, { foreignKey: 'farmerId', as: 'farms' });
Farm.belongsTo(Farmer, { foreignKey: 'farmerId', as: 'farmer' });

// Farm -> Crop (One-to-Many)
Farm.hasMany(Crop, { foreignKey: 'farmId', as: 'crops' });
Crop.belongsTo(Farm, { foreignKey: 'farmId', as: 'farm' });

// Crop -> CropHealth (One-to-Many)
Crop.hasMany(CropHealth, { foreignKey: 'cropId', as: 'healthRecords' });
CropHealth.belongsTo(Crop, { foreignKey: 'cropId', as: 'crop' });

// Farm -> IoTDevice (One-to-Many)
Farm.hasMany(IoTDevice, { foreignKey: 'farmId', as: 'devices' });
IoTDevice.belongsTo(Farm, { foreignKey: 'farmId', as: 'farm' });

// IoTDevice -> SensorReading (One-to-Many)
IoTDevice.hasMany(SensorReading, { foreignKey: 'deviceId', as: 'readings' });
SensorReading.belongsTo(IoTDevice, { foreignKey: 'deviceId', as: 'device' });

// Farm -> IrrigationSchedule (One-to-Many)
Farm.hasMany(IrrigationSchedule, { foreignKey: 'farmId', as: 'irrigationSchedules' });
IrrigationSchedule.belongsTo(Farm, { foreignKey: 'farmId', as: 'farm' });

// Crop -> IrrigationSchedule (One-to-Many, optional)
Crop.hasMany(IrrigationSchedule, { foreignKey: 'cropId', as: 'irrigationSchedules' });
IrrigationSchedule.belongsTo(Crop, { foreignKey: 'cropId', as: 'crop' });

// IoTDevice -> IrrigationSchedule (One-to-Many, optional)
IoTDevice.hasMany(IrrigationSchedule, { foreignKey: 'deviceId', as: 'irrigationSchedules' });
IrrigationSchedule.belongsTo(IoTDevice, { foreignKey: 'deviceId', as: 'device' });

// Crop -> FertilizationRecord (One-to-Many)
Crop.hasMany(FertilizationRecord, { foreignKey: 'cropId', as: 'fertilizationRecords' });
FertilizationRecord.belongsTo(Crop, { foreignKey: 'cropId', as: 'crop' });

// Farmer -> Notification (One-to-Many)
Farmer.hasMany(Notification, { foreignKey: 'farmerId', as: 'notifications' });
Notification.belongsTo(Farmer, { foreignKey: 'farmerId', as: 'farmer' });

// Farm -> Notification (One-to-Many, optional)
Farm.hasMany(Notification, { foreignKey: 'farmId', as: 'notifications' });
Notification.belongsTo(Farm, { foreignKey: 'farmId', as: 'farm' });

// Crop -> Notification (One-to-Many, optional)
Crop.hasMany(Notification, { foreignKey: 'cropId', as: 'notifications' });
Notification.belongsTo(Crop, { foreignKey: 'cropId', as: 'crop' });

export {
  Farmer,
  OTP,
  Farm,
  Crop,
  CropHealth,
  IoTDevice,
  SensorReading,
  IrrigationSchedule,
  FertilizationRecord,
  Notification
};

export default {
  Farmer,
  OTP,
  Farm,
  Crop,
  CropHealth,
  IoTDevice,
  SensorReading,
  IrrigationSchedule,
  FertilizationRecord,
  Notification
};
