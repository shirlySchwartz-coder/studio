import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { decodeToken, isExpired } from "react-jwt";



const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to create auth headers
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

