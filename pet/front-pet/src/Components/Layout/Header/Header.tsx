import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Menu } from '../Menu/Menu';
import { store } from '../../../redux/store';
import { useEffect } from 'react';
import { AuthState } from '../../../redux/AuthReducer';

export function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // auth = useSelector((state: AuthState) => state);
  const auth = store.getState().auth;
  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const logButton = () => {
    return (
      <>
        <input type="button" value="Login" onClick={() => navigate('/login')} />
        <input
          type="button"
          value="Sign-up"
          onClick={() => navigate('/register')}
        />
      </>
    );
  };

  useEffect(() => {
    console.log('Auth state changed:', auth.token);
    if (!auth.token || auth.token.length < 10) {
      navigate('/login');
    }
  }, [auth.token, navigate]);
  return (
    <header className="p-3 bg-blue-500">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-between">
          {/* Logo Left */}
          <a
            href="/"
            className="d-flex align-items-center text-white text-decoration-none"
          >
            <svg
              className="bi me-2"
              width="40"
              height="32"
              role="img"
              aria-label="Bootstrap"
            >
              {/*  <use xlink:href="#bootstrap" />  Fixed to xlink:href */}
            </svg>
            <span className="fs-4">Pet Adoption</span>{' '}
            {/* Added text for logo */}
          </a>

          {/* Menu Center */}
          <Menu />

          {/* Auth Right */}
          <div className="text-end">
            {auth.isLoggedIn ? (
              <>
                <span className="me-2">Welcome, {auth.full_name}!</span>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light me-2"
                >
                  Logout
                </button>
              </>
            ) : (
              logButton()
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
