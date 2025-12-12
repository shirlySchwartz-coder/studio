import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  searchAnimalsByCriteria,
  fetchMedicalFosterAnimals,
  createAnimal,
  fetchAllAnimals,
  fetchAnimalsByShelter,
  updateAnimalById,
  fetchReferenceData,
} from '../../Api/animalApi';
import { AddAnimalData } from '../../Models/AddAnimalData';
import { RootState } from '../store';
import { ReferenceData } from '../../Models/ReferenceData';
import { Animal } from '../../Models/Animal';
import { logout } from './authActions';

export const getAllAnimals = createAsyncThunk<
  Animal[],
  void,
  { rejectValue: string }
>('animals/getAllAnimals', async (_, { rejectWithValue }) => {
  try {
    const animals = await fetchAllAnimals();
    return animals;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'שגיאה בקבלת רשימת החיות'
    );
  }
});

export const searchAnimals = createAsyncThunk<
  Animal[],
  {
    species_id?: string;
    gender_id?: string;
    size_id?: string;
    is_neutered?: boolean;
    vaccination_status?: string;
  },
  { rejectValue: string }
>(
  'animals/searchAnimals',
  async (
    filters: {
      species_id?: string;
      gender_id?: string;
      size_id?: string;
      is_neutered?: boolean;
      vaccination_status?: string;
    },
    { rejectWithValue }
  ) => {
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
      return rejectWithValue(
        error.message || 'שגיאה בטעינת חיות הזקוקות לאומנה רפואית'
      );
    }
  }
);

//**********************פונקציות למנהלים ולעמותות בלבד*********************
export const getAnimalsByShelter = createAsyncThunk<
  Animal[],
  number,
  { rejectValue: string }
>(
  'animals/getAnimals',
  async (shelterId: number, { dispatch, rejectWithValue }) => {
    if (shelterId > 2 && !shelterId) {
      throw new Error('Shelter not linked'); // **[CHANGE]**: בדיקה מקומית
    }
    try {
      const animals = await fetchAnimalsByShelter(shelterId);
      return animals;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log('לא מאומת – מפנים ללוגין');
        dispatch(logout());
      }
      return rejectWithValue(error.response?.data || 'שגיאה');
    }
  }
);

export const addAnimal = createAsyncThunk<
  Animal,
  AddAnimalData,
  { rejectValue: string }
>(
  'animals/addAnimal',
  async (animalData: AddAnimalData, { rejectWithValue }) => {
    try {
      const animal = await createAnimal(animalData);
      return animal as Animal;
    } catch (error: any) {
      return rejectWithValue(error.message || 'שגיאה בהוספת חיה');
    }
  }
);
export const updateAnimal = createAsyncThunk<
  Animal,
  any,
  { rejectValue: string }
>('animals/updateAnimal', async (animalData: any, { rejectWithValue }) => {
  try {
    const updatedAnimal = await updateAnimalById(animalData);
    return updatedAnimal;
  } catch (error: any) {
    return rejectWithValue(error.message || 'שגיאה בעדכון פרטי החיה');
  }
});

export const getReferenceData = createAsyncThunk<
  ReferenceData,
  void,
  { rejectValue: string }
>('animals/fetchReferenceData', async (_, { rejectWithValue }) => {
  try {
    const data = await fetchReferenceData();
    return data as ReferenceData;
  } catch (error: any) {
    return rejectWithValue(error.message || 'שגיאה בטעינת נתוני טבלאות');
  }
});
