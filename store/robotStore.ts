import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
// Remplacement de uuid (nécessite crypto.getRandomValues sur certaines plateformes web/anciennes)
// Générateur simple suffisant pour un store local (timestamp + random base36)
function genId() {
  return (
    Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10)
  );
}

// Type enum des types de robots
export type RobotType = 'industrial' | 'service' | 'medical' | 'educational' | 'other';

// Modèle principal Robot
export interface Robot {
  id: string;
  name: string; // unique (case-insensitive)
  label: string;
  year: number; // integer between 1950 and current year
  type: RobotType;
}

// Données d'entrée (sans id)
export type RobotInput = Omit<Robot, 'id'>;

interface RobotsState {
  robots: Robot[];
  selectedId?: string;
  // Actions
  create: (input: RobotInput) => Robot;
  update: (id: string, input: RobotInput) => Robot;
  remove: (id: string) => void;
  getById: (id: string) => Robot | undefined;
  setSelected: (id: string | undefined) => void;
  clearAll: () => void; // util dev/tests
}

// Helpers validation
const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1950;

function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

function validateInput(input: RobotInput) {
  const errors: string[] = [];
  if (!input.name || input.name.trim().length < 2) errors.push('Name: min 2 caractères');
  if (!input.label || input.label.trim().length < 3) errors.push('Label: min 3 caractères');
  if (!Number.isInteger(input.year)) errors.push('Year: entier requis');
  if (input.year < MIN_YEAR || input.year > CURRENT_YEAR) errors.push(`Year: entre ${MIN_YEAR} et ${CURRENT_YEAR}`);
  if (!input.type) errors.push('Type requis');
  if (errors.length) throw new Error(errors.join(' | '));
}

export const useRobotsStore = create<RobotsState>()(
  persist(
    (set, get) => ({
      robots: [],
      selectedId: undefined,

      create: (input) => {
        validateInput(input);
        const norm = normalizeName(input.name);
        const exists = get().robots.some(r => normalizeName(r.name) === norm);
        if (exists) {
          throw new Error('Name déjà utilisé');
        }
        const robot: Robot = { id: genId(), ...input };
        set(state => ({ robots: [...state.robots, robot] }));
        return robot;
      },

      update: (id, input) => {
        validateInput(input);
        const norm = normalizeName(input.name);
        const robots = get().robots;
        const idx = robots.findIndex(r => r.id === id);
        if (idx === -1) throw new Error('Robot introuvable');
        const duplicate = robots.some(r => r.id !== id && normalizeName(r.name) === norm);
        if (duplicate) throw new Error('Name déjà utilisé');
        const updated: Robot = { id, ...input };
        const next = [...robots];
        next[idx] = updated;
        set({ robots: next });
        return updated;
      },

      remove: (id) => {
        set(state => ({
          robots: state.robots.filter(r => r.id !== id),
          selectedId: state.selectedId === id ? undefined : state.selectedId,
        }));
      },

      getById: (id) => {
        return get().robots.find(r => r.id === id);
      },

      setSelected: (id) => set({ selectedId: id }),

      clearAll: () => set({ robots: [], selectedId: undefined }),
    }),
    {
      name: 'robots-store-v1',
      storage: createJSONStorage(() => AsyncStorage),
      // Optionnel: version pour migrations futures
      version: 1,
      migrate: (persisted, version) => {
        // Placeholder migration si besoin
        return persisted as any;
      },
      partialize: (state) => ({ robots: state.robots, selectedId: state.selectedId }),
    }
  )
);

// Sélecteurs utilitaires (facultatif)
export const useRobots = () => useRobotsStore(s => s.robots);
export const useRobotById = (id?: string) => useRobotsStore(s => (id ? s.robots.find(r => r.id === id) : undefined));
