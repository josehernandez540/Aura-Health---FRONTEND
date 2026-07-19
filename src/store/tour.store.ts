import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TourState {
  seenByUser: Record<string, boolean>;
  hasSeenTour: (userId: string) => boolean;
  markTourSeen: (userId: string) => void;
}

export const useTourStore = create<TourState>()(
  persist(
    (set, get) => ({
      seenByUser: {},

      hasSeenTour: (userId) => !!get().seenByUser[userId],

      markTourSeen: (userId) =>
        set((state) => ({ seenByUser: { ...state.seenByUser, [userId]: true } })),
    }),
    {
      name: "tour-storage",
    }
  )
);
