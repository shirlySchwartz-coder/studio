import { createAsyncThunk } from "@reduxjs/toolkit";
import { uploadImage } from "../../Api/uploadApi";

export const uploadAnimalImage = createAsyncThunk(
  'upload/uploadAnimalImage',
  async ({ file }: { file: File }, { rejectWithValue }) => {
    try {
      // Token is in HttpOnly cookie, sent automatically via axiosInstance
      const response = await uploadImage(file);
      return response.imageUrl || response.image_url;
    } catch (error: any) {
      return rejectWithValue(error.message || 'שגיאה בהעלאת תמונה');
    }
  }
);