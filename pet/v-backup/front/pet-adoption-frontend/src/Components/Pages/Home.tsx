import { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = 'http://localhost:8080/api';

export function Home() {
    const [animals, setAnimals] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
 
    useEffect(() => {
       
            const fetchAnimals = async () => {
        try {
          const response = await axios.get(`${API_URL}/animals/list`, {
           // headers: { Authorization: `Bearer ${token}` },
          });
          setAnimals(response.data.animals);
        } catch (err) {
          setError('Failed to fetch animals');
          console.error(err);
        }
      };
      fetchAnimals();
    
  }, []);


  return (
     <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Pet Adoption App</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {animals.length === 0 && !error ? (
            <p>No animals available</p>
          ) : (
            animals.map((animal) => (
              <li key={animal.id} className="border p-4 rounded shadow">
                <h2 className="text-xl font-semibold">{animal.name}</h2>
                <p>Breed: {animal.breed}</p>
                <p>Species: {animal.species_id === 1 ? 'Dog' : 'Cat'}</p>
                <p>Status: {animal.status_id === 1 ? 'Available' : animal.status_id === 2 ? 'Adopted' : 'Pending'}</p>
              </li>
            ))
          )}
        </ul>
      
    </div>
  );
}

