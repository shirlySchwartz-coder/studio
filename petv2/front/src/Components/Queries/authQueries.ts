import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// התחברות משתמש
export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

// הרשמת משתמש חדש
export const registerUser = async (userData: { full_name: string; email: string; password: string; phone: string; city: string }) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};