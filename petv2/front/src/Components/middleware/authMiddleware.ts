import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export function useAuthToken() {
  const token = useSelector((state: RootState) => state.auth.token);
  return token;
}
export function setAuthHeader(token: string | null) {
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
}