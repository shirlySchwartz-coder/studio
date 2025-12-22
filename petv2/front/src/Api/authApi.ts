import axios from 'axios';
import axiosInstance from './axiosInstance';
import { isRejectedWithValue } from '@reduxjs/toolkit';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// התחברות משתמש
export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials, {
    withCredentials: true,
  });

  // Try to extract token from response headers (Set-Cookie) if not HttpOnly
  // Note: If token is HttpOnly, it won't be accessible via JavaScript
  // In that case, the cookie will be sent automatically with requests
  const setCookieHeader = response.headers['set-cookie'];
  let tokenFromCookie = null;

  if (setCookieHeader) {
    const cookieArray = Array.isArray(setCookieHeader)
      ? setCookieHeader
      : [setCookieHeader];
    for (const cookie of cookieArray) {
      const match = cookie.match(/token=([^;]+)/);
      if (match) {
        tokenFromCookie = match[1];
        break;
      }
    }
  }

  // If token is in response body, use it; otherwise use cookie token (if not HttpOnly)
  const responseData = response.data;
  if (tokenFromCookie && !responseData?.user?.token && !responseData?.token) {
    responseData.token = tokenFromCookie;
  }

  return responseData;
};

// הרשמת משתמש חדש
export const registerUser = async (userData: {
  full_name: string;
  email: string;
  password: string;
  phone: string;
  city_id: number;
}) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

// התנתקות משתמש
export const logoutUser = async () => {
  try {
    await axiosInstance.post(`${API_URL}/auth/logout`);
   
    return ;
  } catch (error: any) {
    throw error;
  }
};

// בדיקת סשן - מחזיר פרטי משתמש אם הטוקן תקין
export const verifySession = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/auth/me`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
