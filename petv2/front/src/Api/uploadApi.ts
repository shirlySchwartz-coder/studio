import axios from 'axios';
import axiosInstance from './axiosInstance';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const uploadImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    console.log('📤 Uploading image to:', `${API_URL}/uploads/`);
    console.log('📤 File details:', {
      filename: file.name,
      size: file.size,
      type: file.type,
    });

    // Token is in HttpOnly cookie, sent automatically via axiosInstance withCredentials
    const response = await axiosInstance.post(`${API_URL}/uploads`, formData);

    console.log('✅ Upload successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Upload failed:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);
    // Provide detailed error messages
    if (error.response) {
      // Server responded with error
      const status = error.response.status;
      const message =
        error.response.data?.error || error.response.data?.message;

      if (status === 401) {
        throw new Error('אינך מורשה להעלות תמונות. אנא התחבר מחדש.');
      } else if (status === 413) {
        throw new Error('התמונה גדולה מדי. גודל מקסימלי: 5MB');
      } else if (status === 415) {
        throw new Error(
          'סוג קובץ לא נתמך. אנא העלה תמונה בפורמט JPG, PNG או GIF'
        );
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
