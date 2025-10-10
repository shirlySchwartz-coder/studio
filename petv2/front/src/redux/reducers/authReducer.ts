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
  userId: localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null,
  fullName: localStorage.getItem('fullName'),
  roleId: localStorage.getItem('roleId') ? Number(localStorage.getItem('roleId')) : null,
  permissions: [],
  token: localStorage.getItem('token'),
  isLoggedIn: !!localStorage.getItem('token'),
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

         localStorage.setItem('token', action.payload.token);
    localStorage.setItem('userId', action.payload.userId.toString());
  localStorage.setItem('fullName', action.payload.fullName);
  localStorage.setItem('roleId', action.payload.roleId.toString());

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
      return {
        ...initialState,
        userId: null,
        roleId:null,
        token: null,
        isLoggedIn:false
      }  
      });
  },
});

export default authSlice.reducer;
