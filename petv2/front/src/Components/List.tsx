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
    <div className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="floating-shape floating-shape-violet w-64 h-64 top-0 left-0"></div>
      <div className="floating-shape w-96 h-96 bg-gradient-to-tl from-cyan-400/10 to-transparent bottom-0 right-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="section-header">
          <div className="section-badge">✨ מיוחד בשבילך</div>
          <h2 className="section-title">חיות מחכות לאימוץ 🐾</h2>
          <p className="section-subtitle">כל אחד מהם מחכה למישהו כמוך</p>
        </div>
        {status === 'loading' && <p>טוען...</p>}
        {error && <p className={errorClass}>{error}</p>}
        <div className="pet-gallery">
          {animals.length > 0 && (
            <>
              {animals.map((animal) => (
                <UserAnimalCard key={animal.id} animal={animal} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
