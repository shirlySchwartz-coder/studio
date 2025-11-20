import { MoreVertical, Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { useEffect } from 'react';
import { getAnimals } from '../../redux/actions/animalActions';

export default function Table() {
  const dispatch = useDispatch<AppDispatch>();
  const { animals, status, error } = useSelector(
    (state: RootState) => state.animals
  );

  const getStatusBadge = (status: string) => {
    const map = {
      available: { label: 'זמין', class: 'status-cyan' },
      pending: { label: 'ממתין', class: 'status-orange' },
      adopted: { label: 'אומץ', class: 'status-mint' },
      fostered: { label: 'באומנה', class: 'status-violet' },
    };
    return map[status as keyof typeof map] || map.available;
  };

  useEffect(() => {
    if (animals.length === 0) {
      dispatch(getAnimals(1));
    }
  }, [dispatch, animals.length]);
  return (
    <div className="overflow-x-auto">
      <table>
        <thead>
          <tr>
            <th>תמונה</th>
            <th>שם</th>
            <th>מין</th>
            <th>גיל</th>
            <th>סטטוס</th>
            <th>תאריך הוספה</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {animals.map((animal) => (
            <tr key={animal.id}>
              <td>
                <img src={animal.image_url} alt={animal.name} />
              </td>
              <td className="name-cell">{animal.name}</td>
              <td>{animal.gender}</td>
              <td>{animal.age}</td>
              <td>
                <span
                  className={`status-badge ${
                    getStatusBadge(animal.status).class
                  }`}
                >
                  {getStatusBadge(animal.status).label}
                </span>
              </td>
              <td>
                {new Date(animal.created_at).toLocaleDateString('he-IL', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </td>
              <td>
                <button>
                  <MoreVertical size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
