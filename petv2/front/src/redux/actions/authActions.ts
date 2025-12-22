import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, logoutUser, registerUser } from '../../Api/authApi';
import { Slide, toast } from 'react-toastify';

export const login = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await loginUser(credentials);

      // Token is in HttpOnly cookie, not needed in response
      const userData = {
        userId: response.user.userId,
        roleId: response.user.roleId,
        fullName: response.user.fullName,
        shelterId: response.user.shelterId || null,
      };
      toast.success('You Are connected', {
        position: 'top-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Slide,
      });
      console.log('login :', response);
      return userData;
    } catch (error: any) {
      const message = error.message || 'שגיאה בהתחברות';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    userData: {
      full_name: string;
      email: string;
      password: string;
      phone: string;
      city_id: number;
    },
    { rejectWithValue }
  ) => {
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
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutUser();

           toast.error('You are logged out! Goodbye...', {
        position: 'top-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Slide,
      });

      return;
    } catch (error: any) {
      return rejectWithValue(error.message || 'שגיאה בהתנתקות');
    }
  }
);
