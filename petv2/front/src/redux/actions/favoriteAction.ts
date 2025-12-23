import { createAsyncThunk } from '@reduxjs/toolkit';
import { addFavoriteApi, checkFavoriteApi, getFavoritesCountApi, getMyFavoritesApi, removeFavoriteApi } from '../../Api/favoriteApi';


// טעינת רשימת מועדפים מלאה
export const fetchMyFavorites = createAsyncThunk<
  any[], // מערך של חיות (אותו מבנה כמו animals)
  void,
  { rejectValue: string }
>('favorites/fetchList', async (_, { rejectWithValue }) => {
  try {
    const myFavorites =  await getMyFavoritesApi();
    return myFavorites;
  } catch (error: any) {
    return rejectWithValue(error.message || 'שגיאה בטעינת המועדפים');
  }
});

// טעינת ספירת מועדפים (ל-badge)
export const fetchFavoritesCount = createAsyncThunk<
  number,
  void,
  { rejectValue: string }
>('favorites/fetchCount', async (_, { rejectWithValue }) => {
  try {
    const favoritesCount = await getFavoritesCountApi();
    return favoritesCount;
  } catch (error: any) {
    return rejectWithValue(error.message || 'שגיאה בטעינת ספירת מועדפים');
  }
});

export const addToFavorites = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>('favorites/add', async (animalId, { rejectWithValue }) => {
  try {
    const newFavorite = await addFavoriteApi(animalId);
    return newFavorite.animal_id || newFavorite || animalId;
  } catch (error: any) {
    const message = error.response?.data?.message || 'שגיאה בהוספה למועדפים';
    return rejectWithValue(message);
  }
});
// הסרה ממועדפים
export const removeFromFavorites = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>('favorites/remove', async (animalId, { rejectWithValue }) => {
  try {
    await removeFavoriteApi(animalId);
    return animalId;
  } catch (error: any) {
    return rejectWithValue(error.message || 'שגיאה בהסרה ממועדפים');
  }
});


// בדיקה אם חיה ספציפית במועדפים
export const checkIsFavorite = createAsyncThunk<
  boolean,
  number,
  { rejectValue: string }
>('favorites/check', async (animalId, { rejectWithValue }) => {
  try {
    return await checkFavoriteApi(animalId);
  } catch (error: any) {
    return rejectWithValue(error.message || 'שגיאה בבדיקת מועדפים');
  }
});