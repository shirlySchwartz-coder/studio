import { createSlice } from '@reduxjs/toolkit';
import { uploadAnimalImage } from '../actions/uploadActions';

interface UploadState {
  imageUrl: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UploadState = {
  imageUrl: null,
  status: 'idle',
  error: null,
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    resetUpload: (state) => {
      state.imageUrl = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadAnimalImage.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(uploadAnimalImage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.imageUrl = action.payload;
        state.error = null;
      })
      .addCase(uploadAnimalImage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.imageUrl = null;
      });
  },
});

export const { resetUpload } = uploadSlice.actions;
export default uploadSlice.reducer;