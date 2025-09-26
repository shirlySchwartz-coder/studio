import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAnimals } from '../../context/AnimalsProvider';
import { useAuth } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Animal } from '../Models/Animal';

const API_URL = 'http://localhost:8080/api';

export function Home() {
  const { animals, setAnimals } = useAnimals();
  const { auth } = useAuth();
  const token = auth.token;
  const navigate = useNavigate();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimals = async () => {
      if (!token) {
        setAnimals([]);
        navigate('/login');
        return;
      }

      // Start loading animation
      setError(null);
      const interval = setInterval(() => {
        setLoadingProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 100);

      try {
        const response = await axios.get(`${API_URL}/animals/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnimals(response.data.animals);
        setLoadingProgress(100);
      } catch (err: any) {
        setError('Failed to load animals. Please try again.');
        setLoadingProgress(100);
      } finally {
        clearInterval(interval);
      }
    };

    fetchAnimals();
  }, [token, setAnimals, navigate]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Home</h1>
      {loadingProgress < 100 ? (
        <div className="mb-4">
          <p className="text-lg">Loading animals... {loadingProgress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-500 h-2.5 rounded-full"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : animals.length !== 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {animals.map((animal: Animal) => (
            <div className="Box">
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
            </div>
          ))}
        </ul>
      ) : (
        <p>No animals available.</p>
      )}
    </div>
  );
}
