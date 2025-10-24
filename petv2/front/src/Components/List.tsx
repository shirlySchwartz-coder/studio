import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { useEffect } from 'react';
import { getAllAnimals } from '../redux/actions/animalActions';
import { errorClass } from '../utils/style';
import AnimalCard from './AnimalCard/AnimalCard';

export function List() {
  const dispatch = useDispatch<AppDispatch>();

  const { animals, status, error } = useSelector(
    (state: RootState) => state.animals
  );
  //const { isLoggedIn, roleId } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (animals.length === 0) {
      dispatch(getAllAnimals());
    }
  }, [dispatch, animals.length]);

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
    </div>
  );
}
