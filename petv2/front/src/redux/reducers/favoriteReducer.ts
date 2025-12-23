import { createSlice } from '@reduxjs/toolkit';
import {
  addToFavorites,
  removeFromFavorites,
  checkIsFavorite,
  fetchFavoritesCount,
  fetchMyFavorites,
} from '../actions/favoriteAction';
import { logout } from '../actions/authActions';

interface FavoritesState {
favoritesList: any[]; 
favoriteIds: number[] ;
  favoritesCount: number; 
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FavoritesState = {
  favoritesList: [],
  favoriteIds: [],
  favoritesCount: 0,
  status: 'idle',
  error: null,
};
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch list
      .addCase(fetchMyFavorites.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMyFavorites.fulfilled, (state, action) => {
        state.favoritesList = action.payload;
        state.favoriteIds= (action.payload.map((animal: any) => animal.animal_id));
        state.status = 'succeeded';
      })
      .addCase(fetchMyFavorites.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // fetch favoritesCount
      .addCase(fetchFavoritesCount.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFavoritesCount.fulfilled, (state, action) => {
        state.favoritesCount = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchFavoritesCount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // add
      .addCase(addToFavorites.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        const animalId= action.payload;
        state.favoriteIds.push(animalId);
        state.favoritesCount += 1;
        state.status = 'succeeded';
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // remove
      .addCase(removeFromFavorites.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(removeFromFavorites.fulfilled, (state,action) => {
        const animalId= action.payload;
        state.favoriteIds = state.favoriteIds.filter(id => id !== animalId);
        state.favoritesCount -= 1;
        state.status = 'succeeded';

      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Reset on logout
      .addCase(logout.fulfilled, (state) => {
        state.favoritesCount = 0;
        state.favoritesList = [];
        state.favoriteIds = [];
        state.status = 'idle';
        state.error = null;
      });
  },
});

export default favoritesSlice.reducer;
