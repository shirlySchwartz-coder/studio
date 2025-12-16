import { createAsyncThunk } from '@reduxjs/toolkit';
import { uploadImage } from '../../Api/uploadApi';

export const uploadAnimalImage = createAsyncThunk(
  'upload/uploadAnimalImage',
  async (
    {
      file,
      animalId,
      shelterId,
    }: { file: File; animalId: number; shelterId: number },
    { rejectWithValue }
  ) => {
    try {
      // Token is in HttpOnly cookie, sent automatically via axiosInstance
      const response = await uploadImage(file, animalId, shelterId);
      return response.imageUrl || response.image_url;
    } catch (error: any) {
      return rejectWithValue(error.message || 'שגיאה בהעלאת תמונה');
    }
  }
);
