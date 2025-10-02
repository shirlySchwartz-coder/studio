import { useActionState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { store } from '../../redux/store';
import { AuthState } from '../../redux/AuthReducer';
import { decodeJWT } from '../utils/decodeJWT';

type LoginState = {
  error: string | null;
  success: boolean;
};

const initialState: LoginState = {
  error: null,
  success: false,
};

async function loginAction(
  prevState: LoginState,
  formData: FormData,
  dispatch: any
): Promise<LoginState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    if (response.data && response.data.token) {
      const userData = response.data;
      if (userData) {
        dispatch({ type: 'LOGIN', payload: { userData } });
        return { error: null, success: true };
      } else {
        dispatch({ type: 'LOGIN_FAILED', payload: 'Invalid token' });
        return { error: 'Invalid token', success: false };
      }
    } else {
      dispatch({ type: 'LOGIN_FAILED', payload: 'Login failed' });
      return { error: 'Login failed', success: false };
    }
  } catch (err: any) {
    return { error: err || 'Login failed', success: false };
  }
}

export function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [state, formAction, isPending] = useActionState(
    (prevState: LoginState, formData: FormData) =>
      loginAction(prevState, formData, dispatch),
    initialState
  );
  const auth = useSelector((state: AuthState) => state);

  useEffect(() => {
    //loginAction(state, new FormData(), dispatch);
    if (state.success || auth.isLoggedIn) {
      //dispatch({ type: 'LOGIN', payload: auth });
      navigate('/home');
    }
  }, [state.success, auth.isLoggedIn, navigate]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Pet Adoption App</h1>
      <form action={formAction} className="mb-4 max-w-md">
        <div className="mb-2">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            defaultValue=""
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            defaultValue=""
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 p-2 border rounded hover:bg-blue-600"
          disabled={isPending}
        >
          {isPending ? 'Logging in...' : 'Login'}
        </button>
        {state.error && <p className="text-red-500 mt-2">{state.error}</p>}
      </form>
    </div>
  );
}
