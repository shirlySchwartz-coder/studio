import axiosInstance from './axiosInstance';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const addFavoriteApi = async (animalId: number) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/favorites/add`, {
      animalId,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

// הסרה ממועדפים
export const removeFavoriteApi = async (animalId: number) => {
  try {
    const response = await axiosInstance.delete(
      `${API_URL}/favorites/${animalId}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
// בדיקת מועדף
export const checkFavoriteApi = async (animalId: number) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/favorites/check/${animalId}`
    );
    return response.data.isFavorite;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

// ספירת מועדפים
export const getFavoritesCountApi = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/favorites/count`);
    return response.data.favorites_count || response.data.count || 0;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

// רשימת מועדפים מלאה
export const getMyFavoritesApi = async () => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/favorites/my-favorites`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
