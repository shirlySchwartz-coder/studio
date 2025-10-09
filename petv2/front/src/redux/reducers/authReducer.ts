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
}

const initialState: AuthState = {
  userId: null,
  fullName: null,
  roleId: null,
  permissions: [],
  token: null,
  isLoggedIn: false,
  status: 'idle',
  error: null,
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
        state.status = 'succeeded';
        state.userId = action.payload.userId;
        state.fullName = action.payload.fullName;
        state.roleId = action.payload.roleId;
        state.token = action.payload.token;
        state.isLoggedIn = true;
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
    .addCase(logout.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userId = null;
        state.fullName = null;
        state.roleId = null;
        state.token = null;
        state.isLoggedIn = false;
      });
  },
});

export default authSlice.reducer;
