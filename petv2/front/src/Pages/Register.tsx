import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../redux/actions/authActions';
import { AppDispatch, RootState } from '../redux/store';
import {
  containerClass,
  formClass,
  inputClass,
  buttonClass,
  errorClass,
  labelClass,
} from '../utils/style';

export function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoggedIn, error, status } = useSelector(
    (state: RootState) => state.auth
  );
  const [userData, setUserData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
  });

  useEffect(() => {}, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(register(userData));
  };

  return (
    <div className={containerClass}>
      <h1 className="text-3xl font-bold mb-4">הרשמה</h1>
      <form onSubmit={handleSubmit} className={formClass}>
        <div className={labelClass}>
          <label>שם מלא</label>
          <input
            type="text"
            value={userData.full_name}
            onChange={(e) =>
              setUserData({ ...userData, full_name: e.target.value })
            }
            className={inputClass}
            required
          />
        </div>
        <div className={labelClass}>
          <label>אימייל</label>
          <input
            type="email"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            className={inputClass}
            required
          />
        </div>
        <div className={labelClass}>
          <label>סיסמה</label>
          <input
            type="password"
            value={userData.password}
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
            className={inputClass}
            required
          />
        </div>
        <div className={labelClass}>
          <label>טלפון</label>
          <input
            type="text"
            value={userData.phone}
            onChange={(e) =>
              setUserData({ ...userData, phone: e.target.value })
            }
            className={inputClass}
          />
        </div>
        <div className={labelClass}>
          <label>עיר</label>
          <input
            type="text"
            value={userData.city}
            onChange={(e) => setUserData({ ...userData, city: e.target.value })}
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          className={buttonClass}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'נרשם...' : 'הירשם'}
        </button>
        {error && <p className={errorClass}>{error}</p>}
      </form>
    </div>
  );
}
