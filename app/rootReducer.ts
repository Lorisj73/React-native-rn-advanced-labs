import robotsReducer from '@/features/robots/robotsSlice';
import { combineReducers } from '@reduxjs/toolkit';

export const rootReducer = combineReducers({
  robots: robotsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
