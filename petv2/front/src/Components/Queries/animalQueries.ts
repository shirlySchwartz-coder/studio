import axios from 'axios';
import { Animal } from '../Models/Animal';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setAuthHeader } from '../middleware/authMiddleware';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// קבלת כל החיות
export const fetchAnimals = async () => {
  
  const { token, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const response = await axios.get(
    `${API_URL}/animals/list`, setAuthHeader(token));
  return response.data.animals;
};

// הוספת חיה חדשה
export const createAnimal = async (animalData: Animal) => {
  const { token, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const response = await axios.post(`${API_URL}/animals/addNew`, animalData,
    setAuthHeader(token));
  return response.data.animal as Animal;
};

// חיפוש חיות לפי קריטריונים
export const searchAnimalsByCriteria = async (filters: { species_id?: string; gender_id?: string; size_id?: string; is_neutered?: boolean; vaccination_status?: string }) => {
  const { token, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const response = await axios.post(
    `${API_URL}/animals/search`, filters, setAuthHeader(token)
  );
  return response.data.animals;
};

// קבלת חיות הזקוקות לאומנה רפואית
export const fetchMedicalFosterAnimals = async () => {
  const { token, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const response = await axios.get(
    `${API_URL}/animals/medical-foster`, setAuthHeader(token));
  return response.data.animals;
};