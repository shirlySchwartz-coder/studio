import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { decodeToken, isExpired } from "react-jwt";

export function getTokenFromLocalStorage() {
  const token = localStorage.getItem('token');
  return token
}
export function useAuthToken() {
  const token = useSelector((state: RootState) => state.auth.token);
  return token;
}
export function setAuthHeader(token: string | null) {
   
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
}

export const CheckAuth = () => {
  let jwt = localStorage.getItem('token')?.split(" ")[1]||'';
  if (jwt.length < 10) return false;
  if (isExpired(jwt)) return false;
  let myDecoded: any = decodeToken(jwt);
  myDecoded.jwt = "Bearer " + jwt;
  return true
}