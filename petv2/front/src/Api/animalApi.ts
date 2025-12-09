import axios from 'axios';
import { Animal } from '../Models/Animal';
import {
  Gender,
  ReferenceData,
  Shelters,
  Size,
  Species,
  Statuses,
} from '../Models/ReferenceData';
import { AddAnimalData } from '../Models/AddAnimalData';
import {
  loadReferenceData,
  saveReferenceData,
} from '../utils/referenceDataUtils';
import axiosInstance from '../middleware/authMiddleware';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

//*****************פונקיות  אורח ללא טוקן********************

// ללא הרשאות קבלת כל החיות
export const fetchAllAnimals = async () => {
  try {
    const response = await axios.get(`${API_URL}/animals/listAll`);
    console.log(response);
    return response.data.animals as Animal[];
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

// קבלת נתוני טבלאות עם שמירה ב-localStorage
export const fetchReferenceData = async (): Promise<ReferenceData> => {
  try {
    const response = await axios.get(`${API_URL}/animals/tables-data/`);
    console.log('✅ Reference data fetched from API:', response.data);

    // שמירה מיידית ב-localStorage דרך helper
    saveReferenceData(response.data.tablesData);

    return {
      sizes: response.data.tablesData.sizes,
      genders: response.data.tablesData.genders,
      species: response.data.tablesData.species,
      statuses: response.data.tablesData.statuses,
      shelters: response.data.tablesData.shelters,
      breeds: response.data.tablesData.breeds,
    };
  } catch (error: any) {
    console.error('❌ Error fetching reference data:', error);
    const fallback = loadReferenceData();
    return fallback;
  }
};

//פונקציות למשתמשים רשומים

// חיפוש חיות לפי קריטריונים
export const searchAnimalsByCriteria = async (filters: {
  species_id?: string;
  gender_id?: string;
  size_id?: string;
  is_neutered?: boolean;
  vaccination_status?: string;
}) => {
  //const token = localStorage.getItem('token');
  const response = await axiosInstance.post(
    `${API_URL}/animals/search`,
    filters
  );
  return response.data.animals;
};

// קבלת חיות הזקוקות לאומנה רפואית
export const fetchMedicalFosterAnimals = async () => {
  const response = await axiosInstance.get(`${API_URL}/animals/medical-foster`);
  return response.data.animals;
};

//**********************פונקציות למנהלים ולעמותות בלבד*********************

// קבלת  חיות של עמותה
export const fetchAnimalsByShelter = async (shelterId: number) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/animals/list/${shelterId}`
    );
    console.log(response);
    return response.data.animals as Animal[];
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

// הוספת חיה חדשה
export const createAnimal = async (animalData: AddAnimalData) => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}/dashboard/addAnimal`,
      animalData
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data.message || 'Error adding animal');
  }
};
// עדכון פרטי חיה
export const updateAnimalById = async (animalData: AddAnimalData) => {
  try {
    const roleId = localStorage.getItem('role_id')
      ? parseInt(localStorage.getItem('role_id') || '0', 10)
      : 0;
    if (roleId >= 3) {
      throw new Error('אין לך הרשאות לעדכן חיה');
    }

    const response = await axiosInstance.put(
      `${API_URL}/animals/updateAnimal/${animalData.id}`,
      animalData
    );
    return response.data.animal as Animal;
  } catch (error: any) {
    console.error('שגיאה בעדכון חיה:', error);
    const message =
      error.response?.data?.message || error.message || 'שגיאה בעדכון החיה';
    throw new Error(message);
  }
};
