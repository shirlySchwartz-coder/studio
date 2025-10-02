import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser ,registerUser} from '../../Components/Queries/authQueries';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'שגיאה בהתחברות');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { full_name: string; email: string; password: string; phone: string; city: string }, { rejectWithValue }) => {
    try {
      const response = await registerUser(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'שגיאה בהרשמה');
    }
  }
);