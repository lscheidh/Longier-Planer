
export type ArenaId = 'halle-1' | 'halle-2' | 'longierzirkel';

export interface TimeSlot {
  start: string; // HH:mm
  end: string;   // HH:mm
}

export interface Booking {
  id: string;
  arenaId: ArenaId;
  date: string; // ISO format YYYY-MM-DD
  slotStart: string;
  slotEnd: string;
  userName: string;
  horseName: string;
}

export interface ArenaConfig {
  id: ArenaId;
  name: string;
  capacity: number;
  slotDuration?: number; // in Minuten, Standard: 25
  schedule: {
    [dayOfWeek: number]: { // 0 = Sunday, 1 = Monday, etc.
      windows: { start: string; end: string }[];
    };
  };
}
