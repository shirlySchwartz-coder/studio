import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser ,registerUser} from '../../Components/Api/authApi';
import { Slide, toast } from 'react-toastify';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      if (response.user) {
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
        return response.user;
      }
      
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
  async (_, { }) => {
    toast.error('You are logged out! Goodbye...', {
position: "top-left",
autoClose: 5000,
hideProgressBar: false,
closeOnClick: false,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "colored",
transition: Slide,
});
    localStorage.removeItem('token');
    localStorage.removeItem('animals');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    localStorage.removeItem('roleId');
    localStorage.clear()
    
    console.log('You are logged out');
    return null;
  }
);

