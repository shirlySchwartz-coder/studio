import { use, useActionState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthProvider';
import { API_URL } from '../utils/sever';

type AddAnimalState = {
  error: string | null;
  success: boolean;
};

const initialState: AddAnimalState = {
  error: null,
  success: false,
};

async function addAnimalAction(
  prevState: AddAnimalState,
  formData: FormData
): Promise<AddAnimalState> {
  const name = formData.get('name') as string;
  const breed = formData.get('breed') as string;
  const species_id = Number(formData.get('species_id'));
  const status_id = Number(formData.get('status_id'));
  const shelter_id = Number(formData.get('shelter_id'));
  const is_neutered = formData.get('is_neutered') === 'on';
  const is_house_trained = formData.get('is_house_trained') === 'on';
  const vaccination_status = formData.get('vaccination_status') as string;

  const token = localStorage.getItem('token');
  if (!token || token.length < 10) {
    return { error: 'Authentication required.', success: false };
  }
  try {
    await axios.post(
      `${API_URL}/animals/add`,
      {
        name,
        breed,
        species_id,
        status_id,
        shelter_id,
        is_neutered,
        is_house_trained,
        vaccination_status,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { error: null, success: true };
  } catch (err: any) {
    if (err.response?.status === 403) {
      return {
        error: 'You do not have permission to add animals.',
        success: false,
      };
    }
    if (err.response?.status === 400) {
      return { error: 'Invalid input data.', success: false };
    }
    return { error: 'Failed to add animal. Please try again.', success: false };
  }
}

export function AddAnimal() {
  const navigate = useNavigate();
  const [state, formAction, isPending] = useActionState(
    addAnimalAction,
    initialState
  );
  const { auth } = useAuth();

  useEffect(() => {
    if (state.success) {
      navigate('/home');
    }
  }, [state.success, navigate]);

  // Assuming role_id 2 is for shelter staff
  if (auth.role_id !== 2) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">
          You do not have permission to add animals.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Add Animal</h1>
      <form action={formAction} className="mb-4 max-w-md">
        <div className="mb-2">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            defaultValue=""
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Breed</label>
          <input
            type="text"
            name="breed"
            defaultValue=""
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Species</label>
          <select
            name="species_id"
            className="border p-2 w-full rounded"
            required
          >
            <option value="1">Dog</option>
            <option value="2">Cat</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Status</label>
          <select
            name="status_id"
            className="border p-2 w-full rounded"
            required
          >
            <option value="1">Available</option>
            <option value="3">Pending</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Shelter ID</label>
          <input
            type="number"
            name="shelter_id"
            defaultValue="1"
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={isPending}
        >
          {isPending ? 'Adding...' : 'Add Animal'}
        </button>
        {state.error && <p className="text-red-500 mt-2">{state.error}</p>}
      </form>
    </div>
  );
}
