import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser ,registerUser} from '../../Components/Queries/authQueries';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      return response.user;
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

export const logout = createAsyncThunk(
  'auth/logout',
  async (_ , {  }) => {
    localStorage.removeItem('token');
    localStorage.removeItem('animals');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    localStorage.removeItem('roleId');
    
    console.log('You are logged out');
    return null;
  }
);

