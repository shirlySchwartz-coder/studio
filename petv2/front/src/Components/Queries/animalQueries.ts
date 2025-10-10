import axios from 'axios';
import { Animal } from '../Models/Animal';
import { getTokenFromLocalStorage, setAuthHeader, useAuthToken } from '../../middleware/authMiddleware';


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// קבלת כל החיות
export const fetchAnimals = async () => {
  try {
     const token = localStorage.getItem('token');
 
      const response = await axios.get(
        `${API_URL}/animals/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
    console.log(response);
    return response.data.animals as Animal[];
       
} catch (error:any) {
  throw new Error (error.response?.data?.message );
}
  
};

// הוספת חיה חדשה
export const createAnimal = async (animalData: Animal) => {
  try {
     const token = localStorage.getItem('token');
   
    const response = await axios.post(`${API_URL}/animals/addNew`,
      animalData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    return response.data;
  } catch (error:any) {
    throw new Error(error.response?.data.message || 'Error adding animal')
  }
};

// חיפוש חיות לפי קריטריונים
export const searchAnimalsByCriteria = async (filters: {
  species_id?: string; gender_id?: string; size_id?: string; is_neutered?: boolean; vaccination_status?: string
}) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_URL}/animals/search`, filters, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  return response.data.animals;
};

// קבלת חיות הזקוקות לאומנה רפואית
export const fetchMedicalFosterAnimals = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(
    `${API_URL}/animals/medical-foster`, {
      headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
    });
  return response.data.animals;
};