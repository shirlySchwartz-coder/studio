import { useActionState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { AuthState } from '../../redux/AuthReducer';

type userInput = {
  full_name: string;
  email: string;
  password: string;
  role_id: number;
  phone?: string;
  city?: string;
};

type RegisterState = {
  error: string | null;
  success: boolean;
};

const initialState: RegisterState = {
  error: null,
  success: false,
};

async function registerAction(
  prevState: RegisterState,
  formData: FormData,
  dispatch: any
): Promise<RegisterState> {
  const full_name = formData.get('full_name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const phone = formData.get('phone') as string | null;
  const city = formData.get('city') as string | null;
  const role_id = 3 | 0; // Assuming role_id 3 is for standard users

  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      full_name,
      email,
      password,
      phone,
      city,
      role_id: 3, // Assuming role_id 3 is for standard users
    });

    return {
      error: null,
      success: response.status === 201,
    };
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
    return {
      ...initialState,
      error: 'Registration failed. Please try again.',
    };
  }
}

export function Register() {
  const dispatch = useDispatch();
  const auth = useSelector((state: AuthState) => state);
  const navigate = useNavigate();
  const [state, formAction, isPending] = useActionState(
    (prevState: RegisterState, formData: FormData) =>
      registerAction(prevState, formData, dispatch),
    initialState
  );

  useEffect(() => {
    if (state.success || auth.isLoggedIn) {
      navigate('/login');
    }
  }, [state.success, auth.isLoggedIn, navigate]);

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
