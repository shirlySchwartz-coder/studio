import { useState, useEffect } from 'react';
import axios from 'axios';
import { Home } from './Home';
import { useNavigate } from 'react-router-dom';
const API_URL = 'http://localhost:8080/api';

export function Login() {
    const [animals, setAnimals] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
    
const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      setToken(response.data.jwt);
      localStorage.setItem('token', response.data.jwt); // Store token in localStorage
      setError(null);
      navigate('/home'); // Refresh the page to load animals
    } catch (err) {
      setError('Login failed');
      console.error(err);
    }
};
    
   
  return (
     <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Pet Adoption App</h1>
      {!token ? (
        <form onSubmit={handleLogin} className="mb-4 max-w-md">
          <div className="mb-2">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full rounded"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Login
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      ) : (
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
      )}
    </div>
  );
}

