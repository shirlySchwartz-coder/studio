import {  configureStore } from '@reduxjs/toolkit';
import { authReducer } from './AuthReducer';
import { animalReducer }  from './AnimalReducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    animals: animalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;