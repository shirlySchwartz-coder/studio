import { useEffect, useActionState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import axiosInstance from '../Api/axiosInstance';

const API_URL = 'http://localhost:8080/api';

type AdoptionRequestState = {
  error: string | null;
  success: boolean;
};

const initialState: AdoptionRequestState = {
  error: null,
  success: false,
};

async function adoptionRequestAction(
  prevState: AdoptionRequestState,
  formData: FormData
): Promise<AdoptionRequestState> {
  const animal_id = Number(formData.get('animal_id'));

  try {
    await axiosInstance.post(
      `${API_URL}/adoption-requests`,
      { animal_id }
    );
    return { error: null, success: true };
  } catch (err: any) {
    if (err.response?.status === 403) {
      return {
        error: 'You do not have permission to submit adoption requests.',
        success: false,
      };
    }
    if (err.response?.status === 400) {
      return { error: 'Invalid animal ID.', success: false };
    }
    return {
      error: 'Failed to submit adoption request. Please try again.',
      success: false,
    };
  }
}

export function AdoptionRequest() {
  const navigate = useNavigate();
  const [state, formAction, isPending] = useActionState(
    adoptionRequestAction,
    initialState
  );
  const { roleId } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (state.success) {
      navigate('/home');
    }
  }, [state.success, navigate]);

  // Assuming role_id 4 is guest
  if (roleId === 4) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">
          You do not have permission to submit adoption requests.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Submit Adoption Request</h1>
      <form action={formAction} className="mb-4 max-w-md">
        <div className="mb-2">
          <label className="block text-sm font-medium">Animal ID</label>
          <input
            type="number"
            name="animal_id"
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
          {isPending ? 'Submitting...' : 'Submit Request'}
        </button>
        {state.error && <p className="text-red-500 mt-2">{state.error}</p>}
      </form>
    </div>
  );
}
