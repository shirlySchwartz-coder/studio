import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Animal } from '../Models/Animal';
import {
  animalReducer,
  AnimalState,
  setAnimalsAction,
} from '../../redux/AnimalReducer';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { RootState } from '../../redux/store';

export function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state: RootState) => state.auth.token);
  const { animals, status, error } = useSelector(
    (state: RootState) => state.animals
  );

  const fetchAnimals = async () => {
    if (!token || token.length < 10) return;
    try {
      const response = await axios.get(`${API_URL}/animals/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        const animalsData: Animal[] = response.data;
        console.log('first', animalsData);
        dispatch({ type: 'GET_ANIMALS', payload: animalsData });
        console.log('after dispatch', animals);
      } else {
        throw new Error('Failed to fetch animals');
      }
    } catch (err) {
      console.error('Failed to fetch animals:', err);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const res = fetchAnimals();
    console.log('fetch animals result:', res);
  }, [token, dispatch, navigate]);

  let content;
  if (status === 'loading') {
    content = (
      <div className="mb-4">
        <p className="text-lg">Loading animals...</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded-full animate-pulse"
            style={{ width: '50%' }}
          ></div>
        </div>
      </div>
    );
  } else if (error) {
    content = <p className="text-red-500">{error}</p>;
  } else if (animals.length === 0) {
    content = <p>No animals available.</p>;
  } else {
    content = (
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {animals.map((animal: Animal) => (
          <li key={animal.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{animal.name}</h2>
            <p>Breed: {animal.breed}</p>
            <p>Species: {animal.species_id === 1 ? 'Dog' : 'Cat'}</p>
            <p>
              Status:{' '}
              {animal.status_id === 1
                ? 'Available'
                : animal.status_id === 2
                ? 'Adopted'
                : 'Pending'}
            </p>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Home</h1>
      {content}
    </div>
  );
}
