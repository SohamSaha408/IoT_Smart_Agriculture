import { Farm, Crop, CropHealth } from '../../models';
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
    sun: {
        azimuth: number;
        elevation: number;
    };
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
export declare const createPolygon: (farm: Farm, boundary: any) => Promise<Polygon | null>;
export declare const getPolygon: (polygonId: string) => Promise<Polygon | null>;
export declare const deletePolygon: (polygonId: string) => Promise<boolean>;
export declare const getNDVIData: (polygonId: string, startDate: Date, endDate: Date) => Promise<NDVIData[]>;
export declare const getSatelliteImagery: (polygonId: string, startDate: Date, endDate: Date) => Promise<SatelliteImage[]>;
export declare const getCurrentWeather: (lat: number, lon: number) => Promise<any>;
export declare const getWeatherForecast: (lat: number, lon: number) => Promise<any>;
export declare const getSoilData: (polygonId: string) => Promise<any>;
export declare const getUVIndex: (lat: number, lon: number) => Promise<any>;
export declare const calculateHealthScore: (ndvi: number) => number;
export declare const getHealthStatus: (score: number) => "excellent" | "healthy" | "moderate" | "stressed" | "critical";
export declare const generateRecommendations: (healthScore: number, ndvi: number, moisture: number | null, temperature: number | null) => string[];
export declare const updateCropHealth: (crop: Crop, polygonId: string) => Promise<CropHealth | null>;
export {};
//# sourceMappingURL=satellite.service.d.ts.map