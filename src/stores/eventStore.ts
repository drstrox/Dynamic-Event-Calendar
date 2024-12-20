import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Event } from '../types/event';

interface EventStore {
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (id: string, updatedEvent: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEventsForDate: (date: Date) => Event[];
  filterEvents: (keyword: string) => Event[];
}

// Custom storage implementation
const customStorage = {
  getItem: (name: string) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null; // Parse the JSON string
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value)); // Stringify the value
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

const useEventStore = create<EventStore>()(
  persist(
    (set, get) => ({
      events: [],

      addEvent: (event) =>
        set((state) => ({ events: [...state.events, event] })),

      updateEvent: (id, updatedEvent) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...updatedEvent } : event
          ),
        })),

      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        })),

      getEventsForDate: (date) =>
        get().events.filter((event) => {
          // Ensure `event.date` is a Date object
          const eventDate = new Date(event.date);
          return eventDate.toDateString() === date.toDateString();
        }),

      filterEvents: (keyword) =>
        get().events.filter((event) =>
          event.name.toLowerCase().includes(keyword.toLowerCase()) ||
          event.description?.toLowerCase().includes(keyword.toLowerCase())
        ),
    }),
    {
      name: 'event-calendar-storage', // Name of the storage
      storage: customStorage, // Use the custom storage
    }
  )
);

export default useEventStore;