import { ReferenceData } from './../../Models/ReferenceData';
import { createSlice } from '@reduxjs/toolkit';
import {
  addAnimal, searchAnimals, getMedicalFosterAnimals,
  getAllAnimals, getAnimals, updateAnimal, getReferenceData
} from '../actions/animalActions';
import { Animal } from '../../Models/Animal';
import { loadReferenceData, saveReferenceData } from '../../utils/referenceDataUtils';

interface AnimalState {
  animals: Animal[];
  referenceData: ReferenceData;
  searchResults: any[];
  medicalFosterAnimals: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AnimalState = {
  animals: localStorage.getItem('animals') ? JSON.parse(localStorage.getItem('animals') || '[]'):[],
  referenceData:loadReferenceData(),
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
      .addCase(getAllAnimals.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getAllAnimals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.animals = action.payload;
        localStorage.setItem('animals', JSON.stringify(action.payload));
      })
      .addCase(getAllAnimals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(getAnimals.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getAnimals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.animals = action.payload;
        localStorage.setItem('animals', JSON.stringify(action.payload));
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
        localStorage.setItem('animals', JSON.stringify(state.animals));
      })
      .addCase(addAnimal.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateAnimal.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateAnimal.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updated = action.payload;
        const index = state.animals.findIndex(a => a.id === updated.id);
        if (index !== -1) {
        state.animals[index] = updated; // עדכון החיה ברשימה
        }
      })
      .addCase(updateAnimal.rejected, (state, action) => {
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
      })
    .addCase(getReferenceData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getReferenceData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.referenceData = action.payload;
        // שמירה אוטומטית ב-localStorage
        saveReferenceData(action.payload);
      })
      .addCase(getReferenceData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        // fallback ל-localStorage
        state.referenceData = loadReferenceData();
      });
  },
});

export default animalSlice.reducer;