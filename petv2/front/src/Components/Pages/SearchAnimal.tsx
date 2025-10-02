import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { searchAnimals } from '../../redux/actions/animalActions';
import { AppDispatch, RootState } from '../../redux/store';
import {
  containerClass,
  formClass,
  inputClass,
  buttonClass,
  errorClass,
  labelClass,
} from '../utils/style';

export function SearchAnimal() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { searchResults, status, error } = useSelector(
    (state: RootState) => state.animals
  );
  const { isLoggedIn, permissions } = useSelector(
    (state: RootState) => state.auth
  );
  const [filters, setFilters] = useState({
    species_id: '',
    gender_id: '',
    size_id: '',
    is_neutered: false,
    vaccination_status: '',
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (!permissions.includes('can_view_public_listings')) {
      navigate('/home');
    }
  }, [isLoggedIn, permissions, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(searchAnimals(filters));
  };

  return (
    <div className={containerClass}>
      <h1 className="text-3xl font-bold mb-4">חיפוש חיות</h1>
      <form onSubmit={handleSubmit} className={formClass}>
        <div className={labelClass}>
          <label>מין</label>
          <select
            name="species_id"
            className={inputClass}
            onChange={(e) =>
              setFilters({ ...filters, species_id: e.target.value })
            }
          >
            <option value="">בחר מין</option>
            <option value="1">כלב</option>
            <option value="2">חתול</option>
          </select>
        </div>
        <div className={labelClass}>
          <label>מגדר</label>
          <select
            name="gender_id"
            className={inputClass}
            onChange={(e) =>
              setFilters({ ...filters, gender_id: e.target.value })
            }
          >
            <option value="">בחר מגדר</option>
            <option value="1">זכר</option>
            <option value="2">נקבה</option>
          </select>
        </div>
        <div className={labelClass}>
          <label>גודל</label>
          <select
            name="size_id"
            className={inputClass}
            onChange={(e) =>
              setFilters({ ...filters, size_id: e.target.value })
            }
          >
            <option value="">בחר גודל</option>
            <option value="1">קטן</option>
            <option value="2">בינוני</option>
            <option value="3">גדול</option>
          </select>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_neutered"
            className={inputClass}
            onChange={(e) =>
              setFilters({ ...filters, is_neutered: e.target.checked })
            }
          />
          <label className={labelClass}>מסורס</label>
        </div>
        <div className={labelClass}>
          <label>סטטוס חיסונים</label>
          <input
            type="text"
            name="vaccination_status"
            className={inputClass}
            onChange={(e) =>
              setFilters({ ...filters, vaccination_status: e.target.value })
            }
          />
        </div>
        <button
          type="submit"
          className={buttonClass}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'מחפש...' : 'חפש'}
        </button>
        {error && <p className={errorClass}>{error}</p>}
      </form>
      {searchResults.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {searchResults.map((animal) => (
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
            </li>
          ))}
        </ul>
      ) : (
        <p>לא נמצאו חיות התואמות לחיפוש.</p>
      )}
    </div>
  );
}
