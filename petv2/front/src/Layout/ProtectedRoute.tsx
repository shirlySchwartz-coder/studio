import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  if (!isLoggedIn) {
    // ניתוב מחדש לדף ההתחברות אם המשתמש לא מחובר
    // Redirect to login page if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
