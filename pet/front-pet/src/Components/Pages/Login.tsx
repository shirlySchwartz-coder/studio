import { useActionState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';

const API_URL = 'http://localhost:8080/api';

type LoginState = {
  error: string | null;
  token: string | null;
  full_name: string | null;
  role_id: number | null;
};

const initialState: LoginState = {
  error: null,
  token: null,
  full_name: null,
  role_id: null,
};

async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    const token = response.data.jwt;
    const role_id = response.data.role_id;
    const full_name = response.data.full_name;
    localStorage.setItem('token', token); // Store token in localStorage

    return { error: null, token, full_name, role_id: role_id };
  } catch (err) {
    console.error(err);
    return {
      error: 'Login failed',
      token: null,
      full_name: null,
      role_id: null,
    };
  }
}
export function Login() {
  const navigate = useNavigate();
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );
  const { setAuth } = useAuth();

  useEffect(() => {
    if (state.token) {
      setAuth({
        token: state.token,
        full_name: state.full_name,
        role_id: state.role_id,
      }); // Update with full user data if needed
      navigate('/home');
    }
  }, [state.token, navigate, setAuth]);

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
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={isPending}
        >
          {isPending ? 'Logging in...' : 'Login'}
        </button>
        {state.error && <p className="text-red-500 mt-2">{state.error}</p>}
      </form>
    </div>
  );
}
