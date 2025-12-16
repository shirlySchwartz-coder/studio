import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../Redux/actions/authActions';
import { AppDispatch, RootState } from '../Redux/store';
import { getReferenceData } from '../Redux/actions/animalActions';
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
  const { referenceData } = useSelector((state: RootState) => state.animals);
  const [userData, setUserData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    city_id: 0,
    role_id: 3,
  });

  useEffect(() => {
    // Ensure reference data (including cities) is loaded for the select
    if (!referenceData?.cities || referenceData.cities.length === 0) {
      // #region agent log
      fetch(
        'http://127.0.0.1:7243/ingest/ba661516-14f1-4506-a49a-cbaf3e4dfb23',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: 'debug-session',
            runId: 'initial',
            hypothesisId: 'H_reg_ref',
            location: 'Register.tsx:useEffect',
            message: 'Dispatching getReferenceData from Register',
            data: {
              hasCities: !!referenceData?.cities,
              citiesLength: referenceData?.cities?.length ?? null,
            },
            timestamp: Date.now(),
          }),
        }
      ).catch(() => {});
      // #endregion

      dispatch(getReferenceData());
    }
  }, [dispatch, referenceData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      full_name: userData.full_name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      city_id: userData.city_id,
    };

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/ba661516-14f1-4506-a49a-cbaf3e4dfb23', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'initial',
        hypothesisId: 'H_reg_submit',
        location: 'Register.tsx:handleSubmit',
        message: 'Submitting register payload',
        data: {
          hasCities: !!referenceData?.cities,
          citiesLength: referenceData?.cities?.length ?? null,
          city_id: userData.city_id,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    dispatch(register(payload));
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
          <label>בחר עיר</label>
          <select
            value={userData.city_id}
            onChange={(e) =>
              setUserData({
                ...userData,
                city_id: parseInt(e.target.value) || 0,
              })
            }
            className={inputClass}
          >
            <option value="">בחר עיר</option>
            {(referenceData.cities || []).map((city: any) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
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
