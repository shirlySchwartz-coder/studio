import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchAnimals, searchAnimalsByCriteria,
  fetchMedicalFosterAnimals, createAnimal,
  fetchAllAnimals,
} from '../../Api/animalApi';

export const getAllAnimals = createAsyncThunk(
  'animals/getAllAnimals',
  async (_, { rejectWithValue }) => {
  try {
    const animals = await fetchAllAnimals();
    return animals;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'שגיאה בקבלת רשימת החיות');
  }
});
//
export const getAnimals = createAsyncThunk(
  'animals/getAnimals',
  async (_, { rejectWithValue }) => {
  try {
    const animals = await fetchAnimals();
    return animals;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'שגיאה בקבלת רשימת החיות');
  }
});

export const addAnimal = createAsyncThunk(
  'animals/addAnimal',
  async (animalData: any, { rejectWithValue }) => {
  try {
    const animal = await createAnimal(animalData);
    return animal;
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

export const getMedicalFosterAnimals = createAsyncThunk(
  'animals/getMedicalFosterAnimals',
  async (_, { rejectWithValue }) => {
  try {
    const animals = await fetchMedicalFosterAnimals();
    return animals;
  } catch (error: any) {
    return rejectWithValue(error.message || 'שגיאה בטעינת חיות הזקוקות לאומנה רפואית');
  }
});

