import { createSlice } from '@reduxjs/toolkit';
import { login, logout, register } from '../actions/authActions';

interface AuthState {
  userId: number | null;
  fullName: string | null;
  roleId: number | null;
  permissions: string[];
  token: string | null;
  isLoggedIn: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  shelterId: number | null;
}

const initialState: AuthState = {
  userId: localStorage.getItem('userId')
    ? Number(localStorage.getItem('userId'))
    : null,
  fullName: localStorage.getItem('fullName'),
  roleId: localStorage.getItem('roleId')
    ? Number(localStorage.getItem('roleId'))
    : 4,
  permissions: [],
  token: localStorage.getItem('token'),
  isLoggedIn: !!localStorage.getItem('token'),
  status: 'idle',
  error: null,
  shelterId: localStorage.getItem('shelterId')
    ? Number(localStorage.getItem('shelterId'))
    : null,
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
        state.token = payload.token;
        state.isLoggedIn = true;
        state.shelterId = payload.shelterId;
        //temp
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('fullName', payload.fullName);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userId = action.payload.userId;
        state.fullName = action.payload.fullName;
        state.roleId = action.payload.roleId;
        state.permissions = action.payload.permissions;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.userId = null;
        state.fullName = null;
        state.roleId = null;
        state.permissions = [];
        state.token = null;
        state.isLoggedIn = false;
        state.status = 'idle';
        state.error = null;
      });
  },
});

export default authSlice.reducer;
