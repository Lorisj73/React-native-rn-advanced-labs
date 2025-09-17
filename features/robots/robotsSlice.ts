import { RootState } from '@/app/rootReducer';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type RobotType = 'industrial' | 'service' | 'medical' | 'educational' | 'other';

export interface Robot {
  id: string;
  name: string;
  label: string;
  year: number;
  type: RobotType;
}

interface RobotsState {
  items: Robot[];
  saving: boolean;
  error?: string | null;
}

const CURRENT_YEAR = new Date().getFullYear();

const initialState: RobotsState = {
  items: [],
  saving: false,
  error: null,
};

// Suppression de uuid (crypto.getRandomValues non dispo sur certains environnements RN sans polyfill)
function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

function assertValid(robot: Omit<Robot, 'id'> | Robot) {
  const errors: string[] = [];
  if (!robot.name || robot.name.trim().length < 2) errors.push('Name min 2');
  if (!robot.label || robot.label.trim().length < 3) errors.push('Label min 3');
  if (!Number.isInteger(robot.year)) errors.push('Year entier');
  if (robot.year < 1950 || robot.year > CURRENT_YEAR) errors.push(`Year entre 1950 et ${CURRENT_YEAR}`);
  if (!robot.type) errors.push('Type requis');
  if (errors.length) throw new Error(errors.join(' | '));
}

export const saveRobotAsync = createAsyncThunk<
  { mode: 'create' | 'update'; id: string },
  { id?: string; data: Omit<Robot, 'id'> },
  { state: RootState }
>(
  'robots/saveRobotAsync',
  async (payload, { dispatch, getState }) => {
    await new Promise(r => setTimeout(r, 500));
    if (payload.id) {
      dispatch(updateRobot({ id: payload.id, changes: payload.data }));
      return { mode: 'update', id: payload.id };
    } else {
      const id = generateId();
      dispatch(createRobot({ ...payload.data, id }));
      return { mode: 'create', id };
    }
  }
);

const robotsSlice = createSlice({
  name: 'robots',
  initialState,
  reducers: {
    createRobot: (state, action: PayloadAction<Robot>) => {
      const incoming = action.payload.id ? action.payload : { ...action.payload, id: generateId() } as Robot;
      assertValid(incoming);
      const nameNorm = incoming.name.trim().toLowerCase();
      const exists = state.items.some(r => r.name.trim().toLowerCase() === nameNorm);
      if (exists) throw new Error('Name déjà utilisé');
      state.items.push(incoming);
    },
    updateRobot: (state, action: PayloadAction<{ id: string; changes: Omit<Robot, 'id'> }>) => {
      const { id, changes } = action.payload;
      assertValid({ ...changes, id });
      const idx = state.items.findIndex(r => r.id === id);
      if (idx === -1) throw new Error('Robot introuvable');
      const norm = changes.name.trim().toLowerCase();
      const collision = state.items.some(r => r.id !== id && r.name.trim().toLowerCase() === norm);
      if (collision) throw new Error('Name déjà utilisé');
      state.items[idx] = { id, ...changes };
    },
    deleteRobot: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(r => r.id !== action.payload);
    },
    clearAll: (state) => { state.items = []; },
  },
  extraReducers: builder => {
    builder
      .addCase(saveRobotAsync.pending, (state) => { state.saving = true; state.error = null; })
      .addCase(saveRobotAsync.fulfilled, (state) => { state.saving = false; })
      .addCase(saveRobotAsync.rejected, (state, action) => { state.saving = false; state.error = action.error.message || 'Erreur async'; });
  }
});

export const { createRobot, updateRobot, deleteRobot, clearAll } = robotsSlice.actions;
export default robotsSlice.reducer;
