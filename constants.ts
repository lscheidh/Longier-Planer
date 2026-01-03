
import { ArenaConfig } from './types';

export const SLOT_DURATION_MINS = 25;

export const ARENA_CONFIGS: ArenaConfig[] = [
  {
    id: 'halle-1',
    name: 'Neue Halle (25x40m)',
    capacity: 1,
    schedule: {
      1: { // Montag
        windows: [
          { start: '09:45', end: '11:45' },
          { start: '19:30', end: '21:00' }
        ]
      },
      5: { // Freitag
        windows: [
          { start: '09:45', end: '11:45' },
          { start: '19:00', end: '21:00' }
        ]
      }
    }
  },
  {
    id: 'halle-2',
    name: 'Alte Halle (20x70m)',
    capacity: 2,
    schedule: {
      1: { // Montag
        windows: [
          { start: '11:45', end: '13:30' },
          { start: '19:00', end: '21:00' }
        ]
      },
      3: { // Mittwoch
        windows: [
          { start: '11:45', end: '13:30' }
        ]
      },
      6: { // Samstag
        windows: [
          { start: '18:00', end: '21:00' }
        ]
      }
    }
  }
];
