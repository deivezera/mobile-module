import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleEventNotifications, cancelEventNotifications } from '../utils/notifications';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export interface Event {
  id: string;
  title: string;
  description?: string;
  targetDate: string; // ISO string
  notificationIds: string[];
}

interface ScheduleState {
  events: Event[];
  addEvent: (title: string, targetDate: Date, description?: string) => Promise<void>;
  updateEvent: (id: string, title: string, targetDate: Date, description?: string) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      events: [],
      addEvent: async (title, targetDate, description) => {
        const id = uuidv4();
        const notificationIds = await scheduleEventNotifications(id, title, targetDate);

        set((state) => ({
          events: [
            ...state.events,
            {
              id,
              title,
              description,
              targetDate: targetDate.toISOString(),
              notificationIds,
            },
          ],
        }));
      },
      updateEvent: async (id, title, targetDate, description) => {
        const state = get();
        const event = state.events.find((e) => e.id === id);
        if (event) {
          await cancelEventNotifications(event.notificationIds);
          const notificationIds = await scheduleEventNotifications(id, title, targetDate);

          set((state) => ({
            events: state.events.map((e) =>
              e.id === id
                ? { ...e, title, description, targetDate: targetDate.toISOString(), notificationIds }
                : e
            ),
          }));
        }
      },
      deleteEvent: async (id) => {
        const state = get();
        const event = state.events.find((e) => e.id === id);
        if (event) {
          await cancelEventNotifications(event.notificationIds);
          set((state) => ({
            events: state.events.filter((e) => e.id !== id),
          }));
        }
      },
    }),
    {
      name: 'schedule-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
