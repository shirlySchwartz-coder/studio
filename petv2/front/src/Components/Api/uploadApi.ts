import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const uploadImage = async (file: File, token: string) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(`${API_URL}/uploads`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    // Provide detailed error messages
    if (error.response) {
      // Server responded with error
      const status = error.response.status;
      const message = error.response.data?.error || error.response.data?.message;
      
      if (status === 401) {
        throw new Error('אינך מורשה להעלות תמונות. אנא התחבר מחדש.');
      } else if (status === 413) {
        throw new Error('התמונה גדולה מדי. גודל מקסימלי: 5MB');
      } else if (status === 415) {
        throw new Error('סוג קובץ לא נתמך. אנא העלה תמונה בפורמט JPG, PNG או GIF');
      } else if (message) {
        throw new Error(message);
      } else {
        throw new Error(`שגיאה בהעלאת התמונה (קוד שגיאה: ${status})`);
      }
    } else if (error.request) {
      // Request made but no response
      throw new Error('לא ניתן להתחבר לשרת. אנא בדוק את חיבור האינטרנט שלך.');
    } else {
      // Something else happened
      throw new Error(error.message || 'שגיאה לא צפויה בהעלאת התמונה');
    }
  }
};