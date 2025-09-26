import { useActionState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthProvider';
import { API_URL } from '../utils/sever';

//const API_URL = 'http://localhost:8080/api';

type RegisterState = {
  error: string | null;
  token: string | null;
  full_name: string | null;
  role_id: number | null;
};

const initialState: RegisterState = {
  error: null,
  token: null,
  full_name: null,
  role_id: null,
};

async function registerAction(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const full_name = formData.get('full_name') as string;

  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
      full_name,
      role_id: 1, // Assuming role_id 1 is for standard users
    });
    const token = response.data.jwt;
    const role_id = response.data.role_id;
    const full_name_response = response.data.full_name;
    localStorage.setItem('token', token); // Store token in localStorage

    return { error: null, token, full_name: full_name_response, role_id };
  } catch (err: any) {
    if (err.response?.status === 403) {
      return {
        ...initialState,
        error: 'You do not have permission to register.',
      };
    }
    if (err.response?.status === 400) {
      return {
        ...initialState,
        error: 'Email already exists or invalid input.',
      };
    }
    return { ...initialState, error: 'Registration failed. Please try again.' };
  }
}

export function Register() {
  const navigate = useNavigate();
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState
  );
  const { setAuth } = useAuth();

  useEffect(() => {
    if (state.token) {
      setAuth({
        token: state.token,
        full_name: state.full_name,
        role_id: state.role_id,
      });
      navigate('/home');
    }
  }, [state.token, navigate, setAuth]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Register for Pet Adoption</h1>
      <form action={formAction} className="mb-4 max-w-md">
        <div className="mb-2">
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="full_name"
            defaultValue=""
            className="border p-2 w-full rounded"
            required
          />
        </div>
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
          {isPending ? 'Registering...' : 'Register'}
        </button>
        {state.error && <p className="text-red-500 mt-2">{state.error}</p>}
      </form>
    </div>
  );
}
