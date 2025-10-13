import { createAsyncThunk } from "@reduxjs/toolkit";
import { uploadImage } from "../../Components/Api/uploadApi";

export const uploadAnimalImage = createAsyncThunk(
  'upload/uploadAnimalImage',
  async ({ file, token }: { file: File; token: string }, { rejectWithValue }) => {
    try {
      const response = await uploadImage(file, token);
      return response.imageUrl || response.image_url ;
    } catch (error: any) {
      return rejectWithValue(error.message || 'שגיאה בהעלאת תמונה');
    }
  }
);