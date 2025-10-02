import { createSlice } from '@reduxjs/toolkit';
import { login, register } from '../actions/authActions';

interface AuthState {
  user_id: number | null;
  full_name: string | null;
  role: string | null;
  permissions: string[];
  token: string | null;
  isLoggedIn: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user_id: null,
  full_name: null,
  role: null,
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
        state.user_id = action.payload.user_id;
        state.full_name = action.payload.full_name;
        state.role = action.payload.role;
        state.permissions = action.payload.permissions;
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
        state.user_id = action.payload.user_id;
        state.full_name = action.payload.full_name;
        state.role = action.payload.role;
        state.permissions = action.payload.permissions;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
