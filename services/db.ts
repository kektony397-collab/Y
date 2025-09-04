
import Dexie, { Table } from 'dexie';
import { TrackingSession } from '../types';

export class AppDatabase extends Dexie {
  sessions!: Table<TrackingSession>;

  constructor() {
    super('GpsTrackerDatabase');
    this.version(1).stores({
      sessions: '++id, name, startTime', // Primary key and indexed props
    });
  }
}

export const db = new AppDatabase();
