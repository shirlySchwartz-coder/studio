import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../Redux/store';
import { useEffect } from 'react';
import { getAllAnimals } from '../Redux/actions/animalActions';
import { errorClass } from '../utils/style';
import { UserAnimalCard } from '../Components/UserAnimalCard/UserAnimalCard';
export function List() {
  const dispatch = useDispatch<AppDispatch>();

  const { animals, status, error } = useSelector(
    (state: RootState) => state.animals
  );

  useEffect(() => {
    if (animals.length === 0) {
      dispatch(getAllAnimals());
    }
  }, [dispatch, animals.length]);

  return (
    <div className="py-20 bg-white relative overflow-hidden">
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
  );
}
