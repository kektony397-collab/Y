
export interface LocationPoint {
  lat: number;
  lng: number;
  timestamp: number;
  speed: number | null; // in km/h
}

export interface TrackingSession {
  id?: number;
  name: string;
  startTime: number;
  endTime: number;
  path: LocationPoint[];
  distance: number; // in km
  area: number; // in square km
}
