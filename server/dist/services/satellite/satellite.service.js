"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCropHealth = exports.generateRecommendations = exports.getHealthStatus = exports.calculateHealthScore = exports.getUVIndex = exports.getSoilData = exports.getWeatherForecast = exports.getCurrentWeather = exports.getSatelliteImagery = exports.getNDVIData = exports.deletePolygon = exports.getPolygon = exports.createPolygon = void 0;
const axios_1 = __importDefault(require("axios"));
const models_1 = require("../../models");
const AGROMONITORING_BASE_URL = 'https://api.agromonitoring.com/agro/1.0';
const API_KEY = process.env.AGROMONITORING_API_KEY;
// Create a polygon for a farm in Agromonitoring
const createPolygon = async (farm, boundary) => {
    try {
        if (!API_KEY) {
            console.warn('Agromonitoring API key not configured');
            return null;
        }
        const response = await axios_1.default.post(`${AGROMONITORING_BASE_URL}/polygons?appid=${API_KEY}`, {
            name: `Farm-${farm.id}`,
            geo_json: {
                type: 'Feature',
                properties: {},
                geometry: boundary
            }
        });
        return response.data;
    }
    catch (error) {
        console.error('Error creating polygon:', error);
        return null;
    }
};
exports.createPolygon = createPolygon;
// Get polygon by ID
const getPolygon = async (polygonId) => {
    try {
        if (!API_KEY)
            return null;
        const response = await axios_1.default.get(`${AGROMONITORING_BASE_URL}/polygons/${polygonId}?appid=${API_KEY}`);
        return response.data;
    }
    catch (error) {
        console.error('Error getting polygon:', error);
        return null;
    }
};
exports.getPolygon = getPolygon;
// Delete polygon
const deletePolygon = async (polygonId) => {
    try {
        if (!API_KEY)
            return false;
        await axios_1.default.delete(`${AGROMONITORING_BASE_URL}/polygons/${polygonId}?appid=${API_KEY}`);
        return true;
    }
    catch (error) {
        console.error('Error deleting polygon:', error);
        return false;
    }
};
exports.deletePolygon = deletePolygon;
// Get NDVI data for a polygon
const getNDVIData = async (polygonId, startDate, endDate) => {
    try {
        if (!API_KEY)
            return [];
        const start = Math.floor(startDate.getTime() / 1000);
        const end = Math.floor(endDate.getTime() / 1000);
        const response = await axios_1.default.get(`${AGROMONITORING_BASE_URL}/ndvi?polyid=${polygonId}&start=${start}&end=${end}&appid=${API_KEY}`);
        return response.data;
    }
    catch (error) {
        console.error('Error getting NDVI data:', error);
        return [];
    }
};
exports.getNDVIData = getNDVIData;
// Get satellite imagery for a polygon
const getSatelliteImagery = async (polygonId, startDate, endDate) => {
    try {
        if (!API_KEY)
            return [];
        const start = Math.floor(startDate.getTime() / 1000);
        const end = Math.floor(endDate.getTime() / 1000);
        const response = await axios_1.default.get(`${AGROMONITORING_BASE_URL}/image/search?polyid=${polygonId}&start=${start}&end=${end}&appid=${API_KEY}`);
        return response.data;
    }
    catch (error) {
        console.error('Error getting satellite imagery:', error);
        return [];
    }
};
exports.getSatelliteImagery = getSatelliteImagery;
// Get current weather for a location
const getCurrentWeather = async (lat, lon) => {
    try {
        if (!API_KEY)
            return null;
        const response = await axios_1.default.get(`${AGROMONITORING_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        return response.data;
    }
    catch (error) {
        console.error('Error getting weather:', error);
        return null;
    }
};
exports.getCurrentWeather = getCurrentWeather;
// Get weather forecast
const getWeatherForecast = async (lat, lon) => {
    try {
        if (!API_KEY)
            return null;
        const response = await axios_1.default.get(`${AGROMONITORING_BASE_URL}/weather/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        return response.data;
    }
    catch (error) {
        console.error('Error getting forecast:', error);
        return null;
    }
};
exports.getWeatherForecast = getWeatherForecast;
// Get soil data
const getSoilData = async (polygonId) => {
    try {
        if (!API_KEY)
            return null;
        const response = await axios_1.default.get(`${AGROMONITORING_BASE_URL}/soil?polyid=${polygonId}&appid=${API_KEY}`);
        return response.data;
    }
    catch (error) {
        console.error('Error getting soil data:', error);
        return null;
    }
};
exports.getSoilData = getSoilData;
// Get UV Index
const getUVIndex = async (lat, lon) => {
    try {
        if (!API_KEY)
            return null;
        const response = await axios_1.default.get(`${AGROMONITORING_BASE_URL}/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        return response.data;
    }
    catch (error) {
        console.error('Error getting UV index:', error);
        return null;
    }
};
exports.getUVIndex = getUVIndex;
// Calculate health score from NDVI
const calculateHealthScore = (ndvi) => {
    // NDVI ranges: -1 to 1
    // -1 to 0: water, snow, clouds, non-vegetated
    // 0 to 0.2: bare soil, rocks
    // 0.2 to 0.4: sparse vegetation
    // 0.4 to 0.6: moderate vegetation
    // 0.6 to 0.8: dense vegetation
    // 0.8 to 1: very dense vegetation
    if (ndvi < 0)
        return 0;
    if (ndvi < 0.2)
        return Math.round(ndvi * 100); // 0-20
    if (ndvi < 0.4)
        return Math.round(20 + (ndvi - 0.2) * 150); // 20-50
    if (ndvi < 0.6)
        return Math.round(50 + (ndvi - 0.4) * 150); // 50-80
    return Math.round(80 + (ndvi - 0.6) * 50); // 80-100
};
exports.calculateHealthScore = calculateHealthScore;
// Determine health status from score
const getHealthStatus = (score) => {
    if (score >= 80)
        return 'excellent';
    if (score >= 60)
        return 'healthy';
    if (score >= 40)
        return 'moderate';
    if (score >= 20)
        return 'stressed';
    return 'critical';
};
exports.getHealthStatus = getHealthStatus;
// Generate recommendations based on health data
const generateRecommendations = (healthScore, ndvi, moisture, temperature) => {
    const recommendations = [];
    // NDVI-based recommendations
    if (ndvi < 0.3) {
        recommendations.push('Crop shows signs of stress. Check for pest infestation or disease.');
        recommendations.push('Consider soil testing for nutrient deficiencies.');
    }
    else if (ndvi < 0.5) {
        recommendations.push('Moderate vegetation health. Ensure adequate water and nutrients.');
    }
    // Moisture-based recommendations
    if (moisture !== null) {
        if (moisture < 30) {
            recommendations.push('Soil moisture is low. Schedule irrigation soon.');
        }
        else if (moisture > 80) {
            recommendations.push('Soil moisture is high. Reduce irrigation to prevent waterlogging.');
        }
    }
    // Temperature-based recommendations
    if (temperature !== null) {
        if (temperature > 35) {
            recommendations.push('High temperature detected. Consider increasing irrigation frequency.');
            recommendations.push('Apply mulching to retain soil moisture.');
        }
        else if (temperature < 10) {
            recommendations.push('Low temperature detected. Monitor for frost damage.');
        }
    }
    // General recommendations based on health score
    if (healthScore < 40) {
        recommendations.push('Consider consulting an agricultural expert for detailed assessment.');
    }
    return recommendations;
};
exports.generateRecommendations = generateRecommendations;
// Fetch and store crop health data
const updateCropHealth = async (crop, polygonId) => {
    try {
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
        // Get NDVI data
        const ndviData = await (0, exports.getNDVIData)(polygonId, startDate, endDate);
        if (ndviData.length === 0) {
            return null;
        }
        // Get latest NDVI
        const latestNDVI = ndviData[ndviData.length - 1];
        const ndviValue = latestNDVI.data.mean;
        // Get weather data
        const farm = await models_1.Farm.findByPk(crop.farmId);
        let weatherData = null;
        if (farm) {
            weatherData = await (0, exports.getCurrentWeather)(parseFloat(farm.latitude.toString()), parseFloat(farm.longitude.toString()));
        }
        // Calculate health metrics
        const healthScore = (0, exports.calculateHealthScore)(ndviValue);
        const healthStatus = (0, exports.getHealthStatus)(healthScore);
        const temperature = weatherData?.main?.temp || null;
        const humidity = weatherData?.main?.humidity || null;
        const moisture = null; // Would come from sensors or satellite
        const recommendations = (0, exports.generateRecommendations)(healthScore, ndviValue, moisture, temperature);
        // Get satellite image URL
        const imagery = await (0, exports.getSatelliteImagery)(polygonId, startDate, endDate);
        const satelliteImageUrl = imagery.length > 0 ? imagery[imagery.length - 1].image.ndvi : null;
        // Create health record
        const healthRecord = await models_1.CropHealth.create({
            cropId: crop.id,
            recordedAt: new Date(latestNDVI.dt * 1000),
            ndviValue,
            healthScore,
            healthStatus,
            moistureLevel: moisture,
            temperature,
            humidity,
            rainfallMm: null,
            soilMoisture: null,
            recommendations,
            satelliteImageUrl,
            dataSource: 'agromonitoring'
        });
        return healthRecord;
    }
    catch (error) {
        console.error('Error updating crop health:', error);
        return null;
    }
};
exports.updateCropHealth = updateCropHealth;
//# sourceMappingURL=satellite.service.js.map