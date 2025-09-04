
import { LocationPoint } from '../types';

// Haversine formula to calculate distance between two points on Earth
export function haversineDistance(p1: LocationPoint, p2: LocationPoint): number {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (p2.lat - p1.lat) * Math.PI / 180;
  const dLon = (p2.lng - p1.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Shoelace formula to calculate area of a polygon
export function shoelaceArea(path: LocationPoint[]): number {
    if (path.length < 3) {
        return 0;
    }
    let area = 0;
    const R = 6371; // Earth radius in km

    for (let i = 0; i < path.length; i++) {
        const p1 = path[i];
        const p2 = path[(i + 1) % path.length];

        // Convert lat/lng to radians
        const lat1 = p1.lat * (Math.PI / 180);
        const lon1 = p1.lng * (Math.PI / 180);
        const lat2 = p2.lat * (Math.PI / 180);
        const lon2 = p2.lng * (Math.PI / 180);
        
        // Using projected coordinates for area calculation
        const x1 = R * lon1 * Math.cos(lat1);
        const y1 = R * lat1;
        const x2 = R * lon2 * Math.cos(lat2);
        const y2 = R * lat2;
        
        area += (x1 * y2 - x2 * y1);
    }

    return Math.abs(area / 2); // Area in square km
}
