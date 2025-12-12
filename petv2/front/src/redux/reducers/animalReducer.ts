import { ReferenceData } from '../../Models/ReferenceData';
import { createSlice } from '@reduxjs/toolkit';
import {
  addAnimal,
  searchAnimals,
  getMedicalFosterAnimals,
  getAllAnimals,
  getAnimalsByShelter,
  updateAnimal,
  getReferenceData,
} from '../actions/animalActions';
import { Animal } from '../../Models/Animal';
import {
  loadReferenceData,
  saveReferenceData,
} from '../../utils/referenceDataUtils';

interface AnimalState {
  animals: Animal[];
  referenceData: ReferenceData;
  searchResults: any[];
  medicalFosterAnimals: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const safeParseAnimals = (): Animal[] => {
  const stored = localStorage.getItem('animals');
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const initialState: AnimalState = {
  animals: safeParseAnimals(),
  referenceData: loadReferenceData(),
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
      .addCase(getAnimalsByShelter.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getAnimalsByShelter.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.animals = action.payload;
        localStorage.setItem('animals', JSON.stringify(action.payload));
      })
      .addCase(getAnimalsByShelter.rejected, (state, action) => {
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
        const index = state.animals.findIndex((a) => a.id === updated.id);
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
        saveReferenceData(action.payload);
      })
      .addCase(getReferenceData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default animalSlice.reducer;
