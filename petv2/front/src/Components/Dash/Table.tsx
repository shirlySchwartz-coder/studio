import { MoreVertical, Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { useEffect } from 'react';
import { getAnimals } from '../../redux/actions/animalActions';

const navItems = [
  { icon: '🏠', label: 'סקירה כללית', active: true },
  { icon: '🐾', label: 'החיות שלי', badge: '24' },
  { icon: '📋', label: 'בקשות אימוץ', badge: '8', badgeColor: 'orange' },
  { icon: '✉️', label: 'הודעות' },
  { icon: '⚙️', label: 'הגדרות' },
  { icon: '🚪', label: 'התנתק' },
];

/* const animals = [
  {
    id: 1,
    name: 'מקס',
    image:
      'https://images.unsplash.com/photo-1734966213753-1b361564bab4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjByZXRyaWV2ZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjI3MTczODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    gender: 'זכר',
    age: 'שנתיים',
    status: 'available',
    date: '1 נובמבר 2025',
  },
  {
    id: 2,
    name: 'לונה',
    image:
      'https://images.unsplash.com/photo-1702914954859-f037fc75b760?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwY2F0JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYyNzY3NDczfDA&ixlib=rb-4.1.0&q=80&w=1080',
    gender: 'נקבה',
    age: 'שנה',
    status: 'pending',
    date: '3 נובמבר 2025',
  },
  {
    id: 3,
    name: 'צ׳רלי',
    image:
      'https://images.unsplash.com/photo-1555557135-0971899f7e3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXBweSUyMGRvZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc2Mjc5ODc2MXww&ixlib=rb-4.1.0&q=80&w=1080',
    gender: 'זכר',
    age: '6 חודשים',
    status: 'adopted',
    date: '5 ספטמבר 2025',
  },
  {
    id: 4,
    name: 'מיה',
    image:
      'https://images.unsplash.com/photo-1583098026747-559b9f41e586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXR0ZW4lMjBjYXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjI3OTg3NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    gender: 'נקבה',
    age: '3 חודשים',
    status: 'fostered',
    date: '10 אוקטובר 2025',
  },
]; */

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
