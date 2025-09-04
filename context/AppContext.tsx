
import React, { createContext, useReducer, useContext, ReactNode, useEffect, useCallback } from 'react';
import { LocationPoint, TrackingSession } from '../types';
import { haversineDistance, shoelaceArea } from '../services/geo';
import { db } from '../services/db';

interface Stats {
  speed: number; // km/h
  distance: number; // km
  duration: number; // seconds
  area: number; // sq km
}

interface AppState {
  isTracking: boolean;
  isPaused: boolean;
  currentPath: LocationPoint[];
  stats: Stats;
  savedSessions: TrackingSession[];
}

type Action =
  | { type: 'START_TRACKING' }
  | { type: 'STOP_TRACKING' }
  | { type: 'PAUSE_TRACKING' }
  | { type: 'RESUME_TRACKING' }
  | { type: 'RESET_TRACKING' }
  | { type: 'ADD_LOCATION_POINT'; payload: GeolocationPosition }
  | { type: 'SET_SAVED_SESSIONS'; payload: TrackingSession[] }
  | { type: 'ADD_SAVED_SESSION'; payload: TrackingSession }
  | { type: 'DELETE_SAVED_SESSION'; payload: number }
  | { type: 'TICK' };

const initialState: AppState = {
  isTracking: false,
  isPaused: false,
  currentPath: [],
  stats: {
    speed: 0,
    distance: 0,
    duration: 0,
    area: 0,
  },
  savedSessions: [],
};

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'START_TRACKING':
      return {
        ...initialState,
        isTracking: true,
        savedSessions: state.savedSessions,
      };
    case 'STOP_TRACKING':
      return { ...state, isTracking: false, isPaused: false };
    case 'PAUSE_TRACKING':
        return { ...state, isPaused: true };
    case 'RESUME_TRACKING':
        return { ...state, isPaused: false };
    case 'RESET_TRACKING':
        return { ...initialState, savedSessions: state.savedSessions };
    case 'ADD_LOCATION_POINT':
      if (state.isPaused) return state;
      const newPoint: LocationPoint = {
        lat: action.payload.coords.latitude,
        lng: action.payload.coords.longitude,
        timestamp: action.payload.timestamp,
        speed: action.payload.coords.speed ? action.payload.coords.speed * 3.6 : 0, // m/s to km/h
      };
      const newPath = [...state.currentPath, newPoint];
      let newDistance = state.stats.distance;
      if (newPath.length > 1) {
        const lastPoint = newPath[newPath.length - 2];
        newDistance += haversineDistance(lastPoint, newPoint);
      }
      const newArea = newPath.length > 2 ? shoelaceArea(newPath) : 0;
      return {
        ...state,
        currentPath: newPath,
        stats: {
          ...state.stats,
          speed: newPoint.speed || 0,
          distance: newDistance,
          area: newArea,
        },
      };
    case 'TICK':
        if (!state.isTracking || state.isPaused) return state;
        return {
            ...state,
            stats: {
                ...state.stats,
                duration: state.stats.duration + 1,
            }
        };
    case 'SET_SAVED_SESSIONS':
        return { ...state, savedSessions: action.payload };
    case 'ADD_SAVED_SESSION':
        return { ...state, savedSessions: [...state.savedSessions, action.payload] };
    case 'DELETE_SAVED_SESSION':
        return { ...state, savedSessions: state.savedSessions.filter(s => s.id !== action.payload) };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const fetchSessions = useCallback(async () => {
    const sessions = await db.sessions.toArray();
    dispatch({ type: 'SET_SAVED_SESSIONS', payload: sessions });
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (state.isTracking && !state.isPaused) {
      timer = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state.isTracking, state.isPaused]);


  useEffect(() => {
    let watchId: number | null = null;

    if (state.isTracking) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          dispatch({ type: 'ADD_LOCATION_POINT', payload: position });
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert(`Error getting location: ${error.message}`);
          dispatch({ type: 'STOP_TRACKING' });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [state.isTracking]);


  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
