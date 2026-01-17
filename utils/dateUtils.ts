
import { format, addMinutes, isAfter, parse, addDays, startOfDay, getDay } from 'date-fns';
import { ArenaConfig, TimeSlot } from '../types';
import { SLOT_DURATION_MINS } from '../constants';

export const getVisibleDates = () => {
  const dates = [];
  const today = startOfDay(new Date());
  // Show today and the next 13 days (approx 2 weeks)
  for (let i = 0; i < 14; i++) {
    dates.push(addDays(today, i));
  }
  return dates;
};

export const generateSlotsForWindow = (startStr: string, endStr: string, slotDuration: number = SLOT_DURATION_MINS): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const referenceDate = new Date();
  
  let current = parse(startStr, 'HH:mm', referenceDate);
  const end = parse(endStr, 'HH:mm', referenceDate);
  // Erlaube eine Überschreitung von maximal 5 Minuten
  const allowedLimit = addMinutes(end, 5);

  while (true) {
    const next = addMinutes(current, slotDuration);
    
    // Wenn das Ende des nächsten Slots mehr als 5 Minuten nach der Endzeit liegt, abbrechen
    if (isAfter(next, allowedLimit)) break;
    
    slots.push({
      start: format(current, 'HH:mm'),
      end: format(next, 'HH:mm')
    });
    current = next;
  }
  
  return slots;
};

export const getAvailableSlotsForDate = (config: ArenaConfig, date: Date): TimeSlot[] => {
  const dayOfWeek = getDay(date);
  const dayConfig = config.schedule[dayOfWeek];
  
  if (!dayConfig) return [];
  
  const slotDuration = config.slotDuration || SLOT_DURATION_MINS;
  
  return dayConfig.windows.flatMap(window => 
    generateSlotsForWindow(window.start, window.end, slotDuration)
  );
};

export const isDateAvailable = (config: ArenaConfig, date: Date): boolean => {
  const dayOfWeek = getDay(date);
  return !!config.schedule[dayOfWeek];
};
