import { createSlice } from '@reduxjs/toolkit';
import { getAnimals, addAnimal, searchAnimals, getMedicalFosterAnimals } from '../actions/animalActions';
import { Animal } from '../../Components/Models/Animal';

interface AnimalState {
  animals: Animal[];
  searchResults: any[];
  medicalFosterAnimals: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AnimalState = {
  animals: [],
  searchResults: [],
  medicalFosterAnimals: [],
  status: 'idle',
  error: null,
};

const animalSlice = createSlice({
  name: 'animals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAnimals.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getAnimals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.animals = action.payload;
      })
      .addCase(getAnimals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(addAnimal.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addAnimal.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.animals.push(action.payload);
      })
      .addCase(addAnimal.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(searchAnimals.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchAnimals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.searchResults = action.payload;
      })
      .addCase(searchAnimals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(getMedicalFosterAnimals.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getMedicalFosterAnimals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.medicalFosterAnimals = action.payload;
      })
      .addCase(getMedicalFosterAnimals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default animalSlice.reducer;