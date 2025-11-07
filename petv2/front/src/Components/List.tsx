import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { useEffect, useState } from 'react';
import { getAllAnimals } from '../redux/actions/animalActions';
import { errorClass } from '../utils/style';
import AnimalCard from './AnimalCard/AnimalCard';
import { UserAnimalCard } from './UserAnimalCard/UserAnimalCard';
import { set } from 'react-hook-form';
import { fetchFormOptionsData } from '../Api/animalApi';

export function List() {
  const dispatch = useDispatch<AppDispatch>();

  const { animals, status, error } = useSelector(
    (state: RootState) => state.animals
  );
  //const { isLoggedIn, roleId } = useSelector((state: RootState) => state.auth);

  const [dropdowns, setDropdowns] = useState({
    genders: [],
    sizes: [],
    species: [],
    statuses: [],
    shelters: [],
    breeds: [],
  });
  useEffect(() => {
    if (animals.length === 0) {
      dispatch(getAllAnimals());
    }
  }, [dispatch, animals.length]);

  useEffect(() => {
    // Fetch dropdown options if needed
    const loadDropdowns = async () => {
      try {
        const data = await fetchFormOptionsData();
        setDropdowns(data);
        localStorage.setItem('animalFormOptions', JSON.stringify(data));
      } catch (error) {
        console.error('Error fetching form options data:', error);
      }
    };
    loadDropdowns();
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">רשימת חיות לאימוץ</h1>

      {status === 'loading' && <p>טוען...</p>}
      {error && <p className={errorClass}>{error}</p>}
      <div>
        {animals.length > 0 && (
          <ul className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {animals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </ul>
        )}
      </div>
      <hr />
      <div>
        {animals.length > 0 && (
          <ul className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {animals.map((animal) => (
              <UserAnimalCard key={animal.id} animal={animal} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
