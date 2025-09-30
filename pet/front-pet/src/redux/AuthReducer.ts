import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit"
import axios from "axios"
import { AnyAction } from '@reduxjs/toolkit';
import { User } from "../Components/Models/User";




 export class AuthState {
  user_id: number=0;
  full_name: string='';
  role_id: number=0
  token: string='';
  isLoggedIn: boolean=false;
  status: 'idle' | 'loading' | 'succeeded' | 'failed' = 'idle';
  error: string | null  = null;
}; 

export interface AuthAction {
  type: string;
  payload?: any;
}

export function loginAction(user: any): AuthAction { 
  return { type: 'LOGIN', payload: user };
}

export function logoutAction(): AuthAction {
  return { type: 'LOGOUT' };
}

export function registerAction(newUser: User): AuthAction {
  return { type: 'REGISTER', payload: newUser };
}

export function updateTokenAction(token: string): AuthAction {
  return { type: 'UPDATE_TOKEN', payload: token };
}

export function authReducer(
  currentState: AuthState = new AuthState(), action: AuthAction): AuthState {
  let newState = { ...currentState };

  switch (action.type) {
    case 'LOGIN':
     
      return {
        ...currentState,
        ...action.payload,
        isLoggedIn: true,
        status: 'succeeded',
        error: null,
      };
      break
    case 'LOGOUT':
      
      return {
        ...new AuthState(),
        status: 'idle',
        error: null,
      };
      break
    case 'REGISTER':
      return {
        ...currentState,
        ...action.payload,
        status: 'succeeded',
        error: null,
      };
      break
    case 'UPDATE_TOKEN':
      return {
        ...currentState,
        token: action.payload,
        status: 'succeeded',
        error: null,
      };
      
    case 'LOGIN_FAILED':
  return { 
    ...currentState, 
    status: 'failed', 
    error: action.payload 
  };
    
    default:
      return currentState;
  }

  return newState;
}


