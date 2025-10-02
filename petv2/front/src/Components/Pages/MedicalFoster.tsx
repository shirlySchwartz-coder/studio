import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMedicalFosterAnimals } from '../../redux/actions/animalActions';
import { AppDispatch, RootState } from '../../redux/store';
import { containerClass, errorClass } from '../utils/style';

export function MedicalFoster() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { medicalFosterAnimals, status, error } = useSelector(
    (state: RootState) => state.animals
  );
  const { isLoggedIn, permissions } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (!permissions.includes('can_view_medical_foster')) {
      navigate('/home');
    } else {
      dispatch(getMedicalFosterAnimals());
    }
  }, [isLoggedIn, permissions, navigate, dispatch]);

  return (
    <div className={containerClass}>
      <h1 className="text-3xl font-bold mb-4">חיות הזקוקות לאומנה רפואית</h1>
      {status === 'loading' && <p>טוען...</p>}
      {error && <p className={errorClass}>{error}</p>}
      {medicalFosterAnimals.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medicalFosterAnimals.map((animal) => (
            <li key={animal.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{animal.name}</h2>
              <p>גזע: {animal.breed}</p>
              <p>מין: {animal.species_id === 1 ? 'כלב' : 'חתול'}</p>
              <p>מגדר: {animal.gender_id === 1 ? 'זכר' : 'נקבה'}</p>
              <p>
                גודל:{' '}
                {animal.size_id === 1
                  ? 'קטן'
                  : animal.size_id === 2
                  ? 'בינוני'
                  : 'גדול'}
              </p>
              <p>צרכים רפואיים: {animal.medical_needs}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>לא נמצאו חיות הזקוקות לאומנה רפואית.</p>
      )}
    </div>
  );
}
