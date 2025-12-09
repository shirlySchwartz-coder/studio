// src/Components/Dash/Table.tsx – גרסה מתוקנת (קומפילציה + mapping + refresh)
import {
  MoreVertical,
  Search,
  ChevronDown,
  ChevronUp,
  Save,
  X,
  Edit3,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Redux/store';
import { useEffect, useState } from 'react';
import {
  getAnimalsByShelter,
  updateAnimal,
} from '../../Redux/actions/animalActions';
import { toast } from 'sonner';
import { Animal } from '../../Models/Animal';
import AnimalEditModal from './AnimalEditModal';

export default function Table() {
  const dispatch = useDispatch<AppDispatch>();
  const { animals, referenceData } = useSelector(
    (state: RootState) => state.animals
  );
  const { shelterId } = useSelector((state: RootState) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Animal>();

  useEffect(() => {
    if (shelterId) {
      dispatch(getAnimalsByShelter(shelterId));
    }
  }, [dispatch, shelterId]);

  // mapping ID לשם להצגה (לא hardcode)
  const getDisplayName = (table: string, id: number | undefined): string => {
    const data = referenceData[table as keyof typeof referenceData];
    return data?.find((item: any) => item.id === id)?.name || 'לא ידוע';
  };

  const getStatusBadge = (statusId: number | string) => {
    const statusName = getDisplayName('statuses', Number(statusId));
    const map: Record<string, string> = {
      1: 'status-available',
      2: 'status-pending',
      3: 'status-adopted',
      4: 'status-fostered',
    };
    const className = map[statusId] || 'status-pending';
    return { label: statusName, class: className };
  };

  return (
    <div className="table-container">
      <table className="w-full">
        <thead className="table-header">
          <tr>
            <th className="p-4 text-right">תמונה</th>
            <th className="p-4 text-right">שם</th>
            <th className="p-4 text-right">מין</th>
            <th className="p-4 text-right">גיל</th>
            <th className="p-4 text-right">גזע</th>
            <th className="p-4 text-right">סטטוס</th>
            <th className="p-4 text-right">פעולות</th>
          </tr>
        </thead>
        <tbody>
          {animals.map((animal) => (
            <tr key={animal.id} className="table-row border-b">
              <td className="p-4">
                <img
                  src={animal.image_url || '/fallback.png'}
                  alt=""
                  className="table-img"
                />
              </td>
              <td className="p-4 font-medium">{animal.name}</td>
              <td className="p-4">
                {getDisplayName('genders', animal.gender_id)}
              </td>
              <td className="p-4">{animal.age}</td>
              <td className="p-4">
                {getDisplayName('breeds', animal.breed_id)}
              </td>
              <td className="p-4">
                <span
                  className={`table-status ${
                    getStatusBadge(animal.status_id).class
                  }`}
                >
                  {getDisplayName('statuses', animal.status_id)}
                </span>
              </td>
              <td className="p-4">
                <button
                  onClick={() => {
                    setSelected(animal);
                    setModalOpen(true);
                  }}
                  className="table-edit-btn"
                >
                  <Edit3 size={20} className="text-cyan-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <AnimalEditModal
          animal={selected}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={async () => {
            if (shelterId) {
              await dispatch(getAnimalsByShelter(shelterId));
            }
          }}
        />
      )}
    </div>
  );
}
