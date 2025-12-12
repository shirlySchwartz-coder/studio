import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
});

// No request interceptor needed - token is in HttpOnly cookie
// Backend reads token from cookie via cookie-parser
// withCredentials: true ensures cookie is sent automatically
axiosInstance.interceptors.request.use(
  (config) => {
    // Token is in HttpOnly cookie, sent automatically with withCredentials: true
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error);
  } // Request made and server responded
);
export default axiosInstance;
