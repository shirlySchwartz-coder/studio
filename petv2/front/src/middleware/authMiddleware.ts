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

/* export const CheckAuth = () => {
  let jwt = localStorage.getItem('token')?.split(" ")[1]||'';
  if (jwt.length < 10) return false;
  if (isExpired(jwt)) return false;
  let myDecoded: any = decodeToken(jwt);
  myDecoded.jwt = "Bearer " + jwt;
  return true
} */