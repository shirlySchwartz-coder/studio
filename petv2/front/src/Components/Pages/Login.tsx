import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../redux/actions/authActions';
import { AppDispatch, RootState } from '../../redux/store';
import {
  containerClass,
  formClass,
  inputClass,
  buttonClass,
  errorClass,
  labelClass,
} from '../utils/style';

export function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoggedIn, error, status } = useSelector(
    (state: RootState) => state.auth
  );
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/home');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(login(credentials));
  };

  return (
    <div className={containerClass}>
      <h1 className="text-3xl font-bold mb-4">התחברות</h1>
      <form onSubmit={handleSubmit} className={formClass}>
        <div className={labelClass}>
          <label>אימייל</label>
          <input
            type="email"
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            className={inputClass}
            required
          />
        </div>
        <div className={labelClass}>
          <label>סיסמה</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            className={inputClass}
            required
          />
        </div>
        <button
          type="submit"
          className={buttonClass}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'מתחבר...' : 'התחבר'}
        </button>
        {error && <p className={errorClass}>{error}</p>}
      </form>
    </div>
  );
}
