import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAnimals, createAnimal, searchAnimalsByCriteria, fetchMedicalFosterAnimals } from '../../Components/Queries/animalQueries';
import { Animal } from '../../Components/Models/Animal';

export const getAnimals = createAsyncThunk('animals/getAnimals',
  async (_, { rejectWithValue }) => {
  try {
    const response = await fetchAnimals();
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'שגיאה בטעינת חיות');
  }
});

export const addAnimal = createAsyncThunk('animals/addAnimal'
  , async (animalData: Animal, { rejectWithValue }) => {
  try {
    const response = await createAnimal(animalData);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'שגיאה בהוספת חיה');
  }
});

export const searchAnimals = createAsyncThunk(
  'animals/searchAnimals',
  async (filters: { species_id?: string; gender_id?: string; size_id?: string; is_neutered?: boolean; vaccination_status?: string }, { rejectWithValue }) => {
    try {
      const animals = await searchAnimalsByCriteria(filters);
      return animals;
    } catch (error: any) {
      return rejectWithValue(error.message || 'שגיאה בחיפוש חיות');
    }
  }
);

export const getMedicalFosterAnimals = createAsyncThunk('animals/getMedicalFosterAnimals', async (_, { rejectWithValue }) => {
  try {
    const animals = await fetchMedicalFosterAnimals();
    return animals;
  } catch (error: any) {
    return rejectWithValue(error.message || 'שגיאה בטעינת חיות הזקוקות לאומנה רפואית');
  }
});