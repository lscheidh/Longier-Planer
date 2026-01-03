
import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { ArenaId, Booking, ArenaConfig, TimeSlot } from './types';
import { ARENA_CONFIGS } from './constants';
import { getAvailableSlotsForDate } from './utils/dateUtils';
import { ArenaSelector } from './components/ArenaSelector';
import { DateSelector } from './components/DateSelector';
import { BookingForm } from './components/BookingForm';

const STORAGE_KEY = 'stable_lunging_bookings_v1';

export default function App() {
  const [selectedArenaId, setSelectedArenaId] = useState<ArenaId | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeBookingSlot, setActiveBookingSlot] = useState<TimeSlot | null>(null);
  const [deletingBookingId, setDeletingBookingId] = useState<string | null>(null);

  // Initiales Laden aus LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch (e) {
        console.error("Fehler beim Laden der Buchungen", e);
      }
    }
  }, []);

  // Speichern bei Änderungen
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  const selectedArena = ARENA_CONFIGS.find(a => a.id === selectedArenaId) || null;

  const handleBooking = (userName: string, horseName: string) => {
    if (!selectedArenaId || !selectedDate || !activeBookingSlot) return;

    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      arenaId: selectedArenaId,
      date: format(selectedDate, 'yyyy-MM-dd'),
      slotStart: activeBookingSlot.start,
      slotEnd: activeBookingSlot.end,
      userName,
      horseName
    };

    setBookings(prev => [...prev, newBooking]);
    setActiveBookingSlot(null);
  };

  const confirmDelete = () => {
    if (deletingBookingId) {
      setBookings(prev => prev.filter(b => b.id !== deletingBookingId));
      setDeletingBookingId(null);
    }
  };

  const getSlotBookings = (date: string, arenaId: string, slotStart: string) => {
    return bookings.filter(b => b.date === date && b.arenaId === arenaId && b.slotStart === slotStart);
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-8 md:pt-12 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 text-emerald-700 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2Z"/><path d="m16 8-4 4-2-2"/><path d="M12 22v-6"/></svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Longier-Planer</h1>
          <p className="text-slate-500 max-w-lg mx-auto">
            Reservieren Sie Ihre Zeiten in der Neuen oder Alten Halle bequem online. 
            Maximale Dauer: 25 Minuten pro Einheit.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="bg-emerald-600 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-sm">1</span>
            Halle wählen
          </h2>
          <ArenaSelector 
            selectedId={selectedArenaId} 
            onSelect={(id) => {
              setSelectedArenaId(id);
              setSelectedDate(null);
            }} 
          />
        </section>

        {selectedArena && (
          <section className="mb-12 animate-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="bg-emerald-600 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-sm">2</span>
              Tag wählen
            </h2>
            <DateSelector 
              config={selectedArena} 
              selectedDate={selectedDate} 
              onSelect={setSelectedDate} 
            />
          </section>
        )}

        {selectedArena && selectedDate && (
          <section className="animate-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="bg-emerald-600 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-sm">3</span>
              Uhrzeit wählen für {format(selectedDate, 'dd. MMMM', { locale: de })}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getAvailableSlotsForDate(selectedArena, selectedDate).map((slot) => {
                const dateStr = format(selectedDate, 'yyyy-MM-dd');
                const slotBookings = getSlotBookings(dateStr, selectedArena.id, slot.start);
                const isFullyBooked = slotBookings.length >= selectedArena.capacity;
                const isPartiallyBooked = slotBookings.length > 0 && slotBookings.length < selectedArena.capacity;

                return (
                  <div 
                    key={slot.start} 
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col ${
                      isFullyBooked 
                        ? 'bg-slate-100 border-slate-200 opacity-80' 
                        : isPartiallyBooked
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-white border-slate-200 hover:border-emerald-500 hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-xl font-bold text-slate-800">{slot.start} - {slot.end}</span>
                        <div className="flex items-center gap-1 mt-1">
                          <span className={`w-2 h-2 rounded-full ${
                            isFullyBooked ? 'bg-red-500' : isPartiallyBooked ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}></span>
                          <span className="text-xs font-medium text-slate-500">
                            {isFullyBooked ? 'Ausgebucht' : isPartiallyBooked ? 'Noch 1 Platz frei' : 'Verfügbar'}
                          </span>
                        </div>
                      </div>
                      
                      {!isFullyBooked && (
                        <button
                          onClick={() => setActiveBookingSlot(slot)}
                          className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/10"
                        >
                          Buchen
                        </button>
                      )}
                    </div>

                    {slotBookings.length > 0 && (
                      <div className="space-y-3 pt-3 border-t border-slate-200 mt-auto">
                        {slotBookings.map(b => (
                          <div key={b.id} className="flex justify-between items-center bg-white/50 p-2 rounded-lg border border-slate-100">
                            <span className="text-sm text-slate-700">
                              <span className="font-bold text-slate-900">{b.horseName}</span>
                              <span className="mx-1 text-slate-400">|</span>
                              <span className="text-xs text-slate-500">{b.userName}</span>
                            </span>
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDeletingBookingId(b.id);
                              }}
                              className="text-slate-400 hover:text-red-600 transition-all p-2 rounded-full hover:bg-red-100 flex items-center justify-center relative z-10"
                              title="Termin löschen"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <footer className="mt-16 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Pferdestall Longier-Management System</p>
          <p className="mt-1 italic">Slots sind auf 25 Minuten begrenzt, um jedem die Nutzung zu ermöglichen.</p>
        </footer>
      </div>

      {activeBookingSlot && (
        <BookingForm
          slotLabel={`${activeBookingSlot.start} - ${activeBookingSlot.end}`}
          onCancel={() => setActiveBookingSlot(null)}
          onBook={handleBooking}
        />
      )}

      {deletingBookingId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Termin löschen?</h2>
              <p className="text-slate-500">Möchten Sie diese Buchung wirklich dauerhaft entfernen? Dies kann nicht rückgängig gemacht werden.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingBookingId(null)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
              >
                Nein
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
              >
                Ja
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
