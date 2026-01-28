import axios from 'axios';
import { Farm, Crop, CropHealth } from '../../models';

const AGROMONITORING_BASE_URL = 'https://api.agromonitoring.com/agro/1.0';
const API_KEY = process.env.AGROMONITORING_API_KEY;

interface Polygon {
  id: string;
  name: string;
  center: [number, number];
  area: number;
}

interface NDVIData {
  dt: number;
  source: string;
  dc: number;
  cl: number;
  data: {
    std: number;
    p75: number;
    min: number;
    max: number;
    median: number;
    p25: number;
    num: number;
    mean: number;
  };
}

interface SatelliteImage {
  dt: number;
  type: string;
  dc: number;
  cl: number;
  sun: { azimuth: number; elevation: number };
  image: {
    truecolor: string;
    falsecolor: string;
    ndvi: string;
    evi: string;
  };
  tile: {
    truecolor: string;
    falsecolor: string;
    ndvi: string;
    evi: string;
  };
  stats: {
    ndvi: string;
    evi: string;
  };
  data: {
    truecolor: string;
    falsecolor: string;
    ndvi: string;
    evi: string;
  };
}

// Create a polygon for a farm in Agromonitoring
export const createPolygon = async (
  farm: Farm,
  boundary: any
): Promise<Polygon | null> => {
  try {
    if (!API_KEY) {
      console.warn('Agromonitoring API key not configured');
      return null;
    }

    const response = await axios.post(
      `${AGROMONITORING_BASE_URL}/polygons?appid=${API_KEY}`,
      {
        name: `Farm-${farm.id}`,
        geo_json: {
          type: 'Feature',
          properties: {},
          geometry: boundary
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating polygon:', error);
    return null;
  }
};

// Get polygon by ID
export const getPolygon = async (polygonId: string): Promise<Polygon | null> => {
  try {
    if (!API_KEY) return null;

    const response = await axios.get(
      `${AGROMONITORING_BASE_URL}/polygons/${polygonId}?appid=${API_KEY}`
    );

    return response.data;
  } catch (error) {
    console.error('Error getting polygon:', error);
    return null;
  }
};

// Delete polygon
export const deletePolygon = async (polygonId: string): Promise<boolean> => {
  try {
    if (!API_KEY) return false;

    await axios.delete(
      `${AGROMONITORING_BASE_URL}/polygons/${polygonId}?appid=${API_KEY}`
    );

    return true;
  } catch (error) {
    console.error('Error deleting polygon:', error);
    return false;
  }
};

// Get NDVI data for a polygon
export const getNDVIData = async (
  polygonId: string,
  startDate: Date,
  endDate: Date
): Promise<NDVIData[]> => {
  try {
    if (!API_KEY) return [];

    const start = Math.floor(startDate.getTime() / 1000);
    const end = Math.floor(endDate.getTime() / 1000);

    const response = await axios.get(
      `${AGROMONITORING_BASE_URL}/ndvi?polyid=${polygonId}&start=${start}&end=${end}&appid=${API_KEY}`
    );

    return response.data;
  } catch (error) {
    console.error('Error getting NDVI data:', error);
    return [];
  }
};

// Get satellite imagery for a polygon
export const getSatelliteImagery = async (
  polygonId: string,
  startDate: Date,
  endDate: Date
): Promise<SatelliteImage[]> => {
  try {
    if (!API_KEY) return [];

    const start = Math.floor(startDate.getTime() / 1000);
    const end = Math.floor(endDate.getTime() / 1000);

    const response = await axios.get(
      `${AGROMONITORING_BASE_URL}/image/search?polyid=${polygonId}&start=${start}&end=${end}&appid=${API_KEY}`
    );

    return response.data;
  } catch (error) {
    console.error('Error getting satellite imagery:', error);
    return [];
  }
};

// Get current weather for a location
export const getCurrentWeather = async (
  lat: number,
  lon: number
): Promise<any> => {
  try {
    if (!API_KEY) return null;

    const response = await axios.get(
      `${AGROMONITORING_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    return response.data;
  } catch (error) {
    console.error('Error getting weather:', error);
    return null;
  }
};

// Get weather forecast
export const getWeatherForecast = async (
  lat: number,
  lon: number
): Promise<any> => {
  try {
    if (!API_KEY) return null;

    const response = await axios.get(
      `${AGROMONITORING_BASE_URL}/weather/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    return response.data;
  } catch (error) {
    console.error('Error getting forecast:', error);
    return null;
  }
};

// Get soil data
export const getSoilData = async (polygonId: string): Promise<any> => {
  try {
    if (!API_KEY) return null;

    const response = await axios.get(
      `${AGROMONITORING_BASE_URL}/soil?polyid=${polygonId}&appid=${API_KEY}`
    );

    return response.data;
  } catch (error) {
    console.error('Error getting soil data:', error);
    return null;
  }
};

// Get UV Index
export const getUVIndex = async (lat: number, lon: number): Promise<any> => {
  try {
    if (!API_KEY) return null;

    const response = await axios.get(
      `${AGROMONITORING_BASE_URL}/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    return response.data;
  } catch (error) {
    console.error('Error getting UV index:', error);
    return null;
  }
};

// Calculate health score from NDVI
export const calculateHealthScore = (ndvi: number): number => {
  // NDVI ranges: -1 to 1
  // -1 to 0: water, snow, clouds, non-vegetated
  // 0 to 0.2: bare soil, rocks
  // 0.2 to 0.4: sparse vegetation
  // 0.4 to 0.6: moderate vegetation
  // 0.6 to 0.8: dense vegetation
  // 0.8 to 1: very dense vegetation
  
  if (ndvi < 0) return 0;
  if (ndvi < 0.2) return Math.round(ndvi * 100); // 0-20
  if (ndvi < 0.4) return Math.round(20 + (ndvi - 0.2) * 150); // 20-50
  if (ndvi < 0.6) return Math.round(50 + (ndvi - 0.4) * 150); // 50-80
  return Math.round(80 + (ndvi - 0.6) * 50); // 80-100
};

// Determine health status from score
export const getHealthStatus = (score: number): 'excellent' | 'healthy' | 'moderate' | 'stressed' | 'critical' => {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'healthy';
  if (score >= 40) return 'moderate';
  if (score >= 20) return 'stressed';
  return 'critical';
};

// Generate recommendations based on health data
export const generateRecommendations = (
  healthScore: number,
  ndvi: number,
  moisture: number | null,
  temperature: number | null
): string[] => {
  const recommendations: string[] = [];

  // NDVI-based recommendations
  if (ndvi < 0.3) {
    recommendations.push('Crop shows signs of stress. Check for pest infestation or disease.');
    recommendations.push('Consider soil testing for nutrient deficiencies.');
  } else if (ndvi < 0.5) {
    recommendations.push('Moderate vegetation health. Ensure adequate water and nutrients.');
  }

  // Moisture-based recommendations
  if (moisture !== null) {
    if (moisture < 30) {
      recommendations.push('Soil moisture is low. Schedule irrigation soon.');
    } else if (moisture > 80) {
      recommendations.push('Soil moisture is high. Reduce irrigation to prevent waterlogging.');
    }
  }

  // Temperature-based recommendations
  if (temperature !== null) {
    if (temperature > 35) {
      recommendations.push('High temperature detected. Consider increasing irrigation frequency.');
      recommendations.push('Apply mulching to retain soil moisture.');
    } else if (temperature < 10) {
      recommendations.push('Low temperature detected. Monitor for frost damage.');
    }
  }

  // General recommendations based on health score
  if (healthScore < 40) {
    recommendations.push('Consider consulting an agricultural expert for detailed assessment.');
  }

  return recommendations;
};

// Fetch and store crop health data
export const updateCropHealth = async (crop: Crop, polygonId: string): Promise<CropHealth | null> => {
  try {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // Last 7 days

    // Get NDVI data
    const ndviData = await getNDVIData(polygonId, startDate, endDate);
    
    if (ndviData.length === 0) {
      return null;
    }

    // Get latest NDVI
    const latestNDVI = ndviData[ndviData.length - 1];
    const ndviValue = latestNDVI.data.mean;

    // Get weather data
    const farm = await Farm.findByPk(crop.farmId);
    let weatherData = null;
    if (farm) {
      weatherData = await getCurrentWeather(
        parseFloat(farm.latitude.toString()),
        parseFloat(farm.longitude.toString())
      );
    }

    // Calculate health metrics
    const healthScore = calculateHealthScore(ndviValue);
    const healthStatus = getHealthStatus(healthScore);
    
    const temperature = weatherData?.main?.temp || null;
    const humidity = weatherData?.main?.humidity || null;
    const moisture = null; // Would come from sensors or satellite

    const recommendations = generateRecommendations(
      healthScore,
      ndviValue,
      moisture,
      temperature
    );

    // Get satellite image URL
    const imagery = await getSatelliteImagery(polygonId, startDate, endDate);
    const satelliteImageUrl = imagery.length > 0 ? imagery[imagery.length - 1].image.ndvi : null;

    // Create health record
    const healthRecord = await CropHealth.create({
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
  } catch (error) {
    console.error('Error updating crop health:', error);
    return null;
  }
};
