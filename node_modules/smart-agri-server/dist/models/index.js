"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = exports.FertilizationRecord = exports.IrrigationSchedule = exports.SensorReading = exports.IoTDevice = exports.CropHealth = exports.Crop = exports.Farm = exports.OTP = exports.Farmer = void 0;
const Farmer_model_1 = __importDefault(require("./Farmer.model"));
exports.Farmer = Farmer_model_1.default;
const OTP_model_1 = __importDefault(require("./OTP.model"));
exports.OTP = OTP_model_1.default;
const Farm_model_1 = __importDefault(require("./Farm.model"));
exports.Farm = Farm_model_1.default;
const Crop_model_1 = __importDefault(require("./Crop.model"));
exports.Crop = Crop_model_1.default;
const CropHealth_model_1 = __importDefault(require("./CropHealth.model"));
exports.CropHealth = CropHealth_model_1.default;
const IoTDevice_model_1 = __importDefault(require("./IoTDevice.model"));
exports.IoTDevice = IoTDevice_model_1.default;
const SensorReading_model_1 = __importDefault(require("./SensorReading.model"));
exports.SensorReading = SensorReading_model_1.default;
const IrrigationSchedule_model_1 = __importDefault(require("./IrrigationSchedule.model"));
exports.IrrigationSchedule = IrrigationSchedule_model_1.default;
const FertilizationRecord_model_1 = __importDefault(require("./FertilizationRecord.model"));
exports.FertilizationRecord = FertilizationRecord_model_1.default;
const Notification_model_1 = __importDefault(require("./Notification.model"));
exports.Notification = Notification_model_1.default;
// Define associations
// Farmer -> Farm (One-to-Many)
Farmer_model_1.default.hasMany(Farm_model_1.default, { foreignKey: 'farmerId', as: 'farms' });
Farm_model_1.default.belongsTo(Farmer_model_1.default, { foreignKey: 'farmerId', as: 'farmer' });
// Farm -> Crop (One-to-Many)
Farm_model_1.default.hasMany(Crop_model_1.default, { foreignKey: 'farmId', as: 'crops' });
Crop_model_1.default.belongsTo(Farm_model_1.default, { foreignKey: 'farmId', as: 'farm' });
// Crop -> CropHealth (One-to-Many)
Crop_model_1.default.hasMany(CropHealth_model_1.default, { foreignKey: 'cropId', as: 'healthRecords' });
CropHealth_model_1.default.belongsTo(Crop_model_1.default, { foreignKey: 'cropId', as: 'crop' });
// Farm -> IoTDevice (One-to-Many)
Farm_model_1.default.hasMany(IoTDevice_model_1.default, { foreignKey: 'farmId', as: 'devices' });
IoTDevice_model_1.default.belongsTo(Farm_model_1.default, { foreignKey: 'farmId', as: 'farm' });
// IoTDevice -> SensorReading (One-to-Many)
IoTDevice_model_1.default.hasMany(SensorReading_model_1.default, { foreignKey: 'deviceId', as: 'readings' });
SensorReading_model_1.default.belongsTo(IoTDevice_model_1.default, { foreignKey: 'deviceId', as: 'device' });
// Farm -> IrrigationSchedule (One-to-Many)
Farm_model_1.default.hasMany(IrrigationSchedule_model_1.default, { foreignKey: 'farmId', as: 'irrigationSchedules' });
IrrigationSchedule_model_1.default.belongsTo(Farm_model_1.default, { foreignKey: 'farmId', as: 'farm' });
// Crop -> IrrigationSchedule (One-to-Many, optional)
Crop_model_1.default.hasMany(IrrigationSchedule_model_1.default, { foreignKey: 'cropId', as: 'irrigationSchedules' });
IrrigationSchedule_model_1.default.belongsTo(Crop_model_1.default, { foreignKey: 'cropId', as: 'crop' });
// IoTDevice -> IrrigationSchedule (One-to-Many, optional)
IoTDevice_model_1.default.hasMany(IrrigationSchedule_model_1.default, { foreignKey: 'deviceId', as: 'irrigationSchedules' });
IrrigationSchedule_model_1.default.belongsTo(IoTDevice_model_1.default, { foreignKey: 'deviceId', as: 'device' });
// Crop -> FertilizationRecord (One-to-Many)
Crop_model_1.default.hasMany(FertilizationRecord_model_1.default, { foreignKey: 'cropId', as: 'fertilizationRecords' });
FertilizationRecord_model_1.default.belongsTo(Crop_model_1.default, { foreignKey: 'cropId', as: 'crop' });
// Farmer -> Notification (One-to-Many)
Farmer_model_1.default.hasMany(Notification_model_1.default, { foreignKey: 'farmerId', as: 'notifications' });
Notification_model_1.default.belongsTo(Farmer_model_1.default, { foreignKey: 'farmerId', as: 'farmer' });
// Farm -> Notification (One-to-Many, optional)
Farm_model_1.default.hasMany(Notification_model_1.default, { foreignKey: 'farmId', as: 'notifications' });
Notification_model_1.default.belongsTo(Farm_model_1.default, { foreignKey: 'farmId', as: 'farm' });
// Crop -> Notification (One-to-Many, optional)
Crop_model_1.default.hasMany(Notification_model_1.default, { foreignKey: 'cropId', as: 'notifications' });
Notification_model_1.default.belongsTo(Crop_model_1.default, { foreignKey: 'cropId', as: 'crop' });
exports.default = {
    Farmer: Farmer_model_1.default,
    OTP: OTP_model_1.default,
    Farm: Farm_model_1.default,
    Crop: Crop_model_1.default,
    CropHealth: CropHealth_model_1.default,
    IoTDevice: IoTDevice_model_1.default,
    SensorReading: SensorReading_model_1.default,
    IrrigationSchedule: IrrigationSchedule_model_1.default,
    FertilizationRecord: FertilizationRecord_model_1.default,
    Notification: Notification_model_1.default
};
//# sourceMappingURL=index.js.map