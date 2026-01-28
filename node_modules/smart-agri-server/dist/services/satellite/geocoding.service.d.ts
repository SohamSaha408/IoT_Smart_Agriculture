interface ReverseGeocodeResult {
    village: string | null;
    district: string | null;
    state: string | null;
    pincode: string | null;
}
interface GeocodeResult {
    latitude: number;
    longitude: number;
    village: string;
    district: string;
    state: string;
}
export declare const reverseGeocode: (lat: number, lon: number) => Promise<ReverseGeocodeResult>;
export declare const geocodeVillage: (village: string, district?: string, state?: string) => Promise<GeocodeResult | null>;
export declare const getLULCStats: (lat: number, lon: number, radius?: number) => Promise<any>;
export declare const determineLandType: (lat: number, lon: number) => Promise<string | null>;
export {};
//# sourceMappingURL=geocoding.service.d.ts.map