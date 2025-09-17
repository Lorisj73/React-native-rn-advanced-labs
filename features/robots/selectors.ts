import { RootState } from '@/app/rootReducer';
import { createSelector } from '@reduxjs/toolkit';

export const selectRobots = (s: RootState) => s.robots.items;
export const selectRobotById = (id?: string) => (s: RootState) => id ? s.robots.items.find(r => r.id === id) : undefined;
export const selectRobotsSortedByName = createSelector([selectRobots], items => [...items].sort((a,b)=> a.name.localeCompare(b.name,'fr',{sensitivity:'base'})));
export const selectRobotsSortedByYear = createSelector([selectRobots], items => [...items].sort((a,b)=> a.year - b.year || a.name.localeCompare(b.name,'fr',{sensitivity:'base'})));

export const makeSelectRobotsSorted = (sort: 'name' | 'year') =>
  createSelector([selectRobots], items => {
    const arr = [...items];
    if (sort === 'name') return arr.sort((a,b)=> a.name.localeCompare(b.name,'fr',{sensitivity:'base'}));
    return arr.sort((a,b)=> a.year - b.year || a.name.localeCompare(b.name,'fr',{sensitivity:'base'}));
  });
