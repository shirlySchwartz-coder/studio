import { createSlice } from '@reduxjs/toolkit';
import { login, logout, register } from '../actions/authActions';

interface AuthState {
  userId: number | null;
  fullName: string | null;
  roleId: number | null;
  permissions: string[];
  isLoggedIn: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  shelterId: number | null;
}

const initialState: AuthState = {
  userId: null,
  fullName: null,
  roleId: null,
  permissions: [],
  isLoggedIn: false,
  status: 'idle',
  error: null,
  shelterId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const payload = action.payload;
        if (!payload) return;

        state.status = 'succeeded';
        state.userId = payload.userId;
        state.fullName = payload.fullName;
        state.roleId = payload.roleId;
        state.isLoggedIn = true;
        state.shelterId = payload.shelterId;

        // Store user data in localStorage for refresh restoration (not token)
        if (payload.shelterId) {
          localStorage.setItem('shelterId', payload.shelterId.toString());
        }
        localStorage.setItem('fullName', payload.fullName);
        localStorage.setItem('userId', payload.userId?.toString() || '');
        localStorage.setItem('roleId', payload.roleId?.toString() || '');
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userId = action.payload.userId;
        state.fullName = action.payload.fullName;
        state.roleId = action.payload.roleId;
        state.permissions = action.payload.permissions;
        state.isLoggedIn = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.userId = 0;
        state.fullName = '';
        state.roleId = 0;
        state.shelterId = 0;
        // Clear localStorage (token is in cookie, cleared by backend)
        localStorage.removeItem('shelterId');
        localStorage.removeItem('fullName');
        localStorage.removeItem('userId');
        localStorage.removeItem('roleId');
      });
  },
});

export default authSlice.reducer;
