import { create } from 'zustand';
import type { Drug, Message, PillarView, Toast } from '../types';

interface AppState {
  activeView: PillarView;
  watchlist: Drug[];
  activeDrug: Drug | null;
  checkerDrugs: string[];
  chatHistory: Message[];
  graphDepth: 1 | 2 | 3;
  pathfindMode: boolean;
  pathfindSelection: [string | null, string | null];
  rightDrawerOpen: boolean;
  mobileMenuOpen: boolean;
  toasts: Toast[];

  setActiveView: (view: PillarView) => void;
  addToWatchlist: (drug: Drug) => void;
  removeFromWatchlist: (drugId: string) => void;
  setActiveDrug: (drug: Drug | null) => void;
  openRightDrawer: (drug: Drug) => void;
  closeRightDrawer: () => void;
  addCheckerDrug: (drug: string) => void;
  removeCheckerDrug: (drug: string) => void;
  clearCheckerDrugs: () => void;
  addMessage: (message: Message) => void;
  clearChat: () => void;
  setGraphDepth: (depth: 1 | 2 | 3) => void;
  togglePathfindMode: () => void;
  setPathfindSelection: (selection: [string | null, string | null]) => void;
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  activeView: 'landing',
  watchlist: [],
  activeDrug: null,
  checkerDrugs: [],
  chatHistory: [],
  graphDepth: 2,
  pathfindMode: false,
  pathfindSelection: [null, null],
  rightDrawerOpen: false,
  mobileMenuOpen: false,
  toasts: [],

  setActiveView: (view) => set({ activeView: view }),

  addToWatchlist: (drug) =>
    set((state) => {
      if (!state.watchlist.find((d) => d.id === drug.id)) {
        return { watchlist: [...state.watchlist, drug] };
      }
      return {};
    }),

  removeFromWatchlist: (drugId) =>
    set((state) => ({ watchlist: state.watchlist.filter((d) => d.id !== drugId) })),

  setActiveDrug: (drug) => set({ activeDrug: drug }),

  openRightDrawer: (drug) => set({ activeDrug: drug, rightDrawerOpen: true }),

  closeRightDrawer: () => set({ rightDrawerOpen: false, activeDrug: null }),

  addCheckerDrug: (drug) =>
    set((state) => {
      const trimmed = drug.trim();
      if (state.checkerDrugs.length < 10 && !state.checkerDrugs.includes(trimmed)) {
        return { checkerDrugs: [...state.checkerDrugs, trimmed] };
      }
      return {};
    }),

  removeCheckerDrug: (drug) =>
    set((state) => ({ checkerDrugs: state.checkerDrugs.filter((d) => d !== drug) })),

  clearCheckerDrugs: () => set({ checkerDrugs: [] }),

  addMessage: (message) =>
    set((state) => ({ chatHistory: [...state.chatHistory, message] })),

  clearChat: () => set({ chatHistory: [] }),

  setGraphDepth: (depth) => set({ graphDepth: depth }),

  togglePathfindMode: () =>
    set((state) => ({
      pathfindMode: !state.pathfindMode,
      pathfindSelection: [null, null],
    })),

  setPathfindSelection: (selection) => set({ pathfindSelection: selection }),

  addToast: (message, type = 'info') => {
    const id = Math.random().toString(36).slice(2);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => get().removeToast(id), 4000);
  },

  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
}));
