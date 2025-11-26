// src/Components/Dash/Table.tsx – גרסה מתוקנת (קומפילציה + mapping + refresh)
import {
  MoreVertical,
  Search,
  ChevronDown,
  ChevronUp,
  Save,
  X,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { useEffect, useState } from 'react';
import { getAnimals, updateAnimal } from '../../redux/actions/animalActions';
import { toast } from 'sonner';

export default function Table() {
  const dispatch = useDispatch<AppDispatch>();
  const { animals, referenceData } = useSelector(
    (state: RootState) => state.animals
  );
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    const shelterId = Number(localStorage.getItem('shelterId'));
    if (shelterId) {
      dispatch(getAnimals(shelterId));
    }
  }, [dispatch, animals.length]);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
    if (expandedId !== id) {
      const animal = animals.find((a) => a.id === id);
      setEditData(animal || {});
    }
  };

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

  const handleSave = async () => {
    try {
      console.log('📤 שולחת עדכון:', editData);
      const actionResult = await dispatch(updateAnimal(editData)); // שמור actionResult
      if (updateAnimal.fulfilled.match(actionResult)) {
        // תיקון: actionResult במקום result
        toast.success('החיה עודכנה בהצלחה! 🐾', {
          description: 'רענון הטבלה...',
        });
        setExpandedId(null);
        // refresh מיידי – קריאה מחדש לרשימת חיות
        const userId = Number(localStorage.getItem('shelterId'));
        await dispatch(getAnimals(userId));
      } else {
        const errorMsg = (actionResult as any).payload || 'שגיאה לא ידועה';
        toast.error('שגיאה בשמירה', { description: errorMsg });
      }
    } catch (error: any) {
      toast.error('משהו השתבש', { description: error.message || 'בדקי חיבור' });
    }
  };

  return (
    <div className="animals-table-container">
      <table className="animals-table">
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
            <>
              <tr key={animal.id}>
                <td>
                  <img
                    src={animal.image_url}
                    alt={animal.name}
                    className="animal-thumbnail"
                  />
                </td>
                <td className="animal-name">{animal.name}</td>
                <td>{getDisplayName('genders', animal.gender_id)}</td>{' '}
                {/* תיקון: ID → שם */}
                <td>{animal.age} חודשים</td>
                <td>
                  <span
                    className={`status-badge ${
                      getStatusBadge(animal.status_id).class
                    }`}
                  >
                    {getStatusBadge(animal.status_id).label}
                  </span>
                </td>
                <td>
                  {new Date(animal.created_at).toLocaleDateString('he-IL')}
                </td>
                <td>
                  <button
                    className="action-button"
                    onClick={() => toggleExpand(animal.id)}
                  >
                    {expandedId === animal.id ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                </td>
              </tr>

              {expandedId === animal.id && (
                <tr className="edit-row" key={animal.name}>
                  <td colSpan={7}>
                    <div className="edit-row-content">
                      <div className="edit-field">
                        <label>שם החיה</label>
                        <input
                          value={editData.name || ''}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="edit-field">
                        <label>גיל (חודשים)</label>
                        <input
                          type="number"
                          value={editData.age_months || ''}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              age_months: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="edit-field">
                        <label>מין</label>
                        <select
                          value={editData.gender_id || ''}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              gender_id: parseInt(e.target.value),
                            })
                          }
                        >
                          <option value="">בחר מין</option>
                          {referenceData.genders?.map((g: any) => (
                            <option key={g.id} value={g.id}>
                              {g.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="edit-field">
                        <label>סטטוס</label>
                        <select
                          value={editData.status_id || ''}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              status_id: parseInt(e.target.value),
                            })
                          }
                        >
                          <option value="">בחר סטטוס</option>
                          {referenceData.statuses?.map((s: any) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="edit-field">
                        <label>סוג חיה</label>
                        <select
                          value={editData.species_id || ''}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              species_id: parseInt(e.target.value),
                            })
                          }
                        >
                          <option value="">בחר סוג</option>
                          {referenceData.species?.map((sp: any) => (
                            <option key={sp.id} value={sp.id}>
                              {sp.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="edit-field">
                        <label>גודל</label>
                        <select
                          value={editData.size_id || ''}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              size_id: parseInt(e.target.value),
                            })
                          }
                        >
                          <option value="">בחר גודל</option>
                          {referenceData.sizes?.map((sz: any) => (
                            <option key={sz.id} value={sz.id}>
                              {sz.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="edit-field">
                        <label>גזע</label>
                        <select
                          value={editData.breed_id || ''}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              breed_id: parseInt(e.target.value),
                            })
                          }
                        >
                          <option value="">בחר גזע</option>
                          {referenceData.breeds?.map((b: any) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="edit-field">
                        <label>חיסונים</label>
                        <input
                          value={editData.vaccination_status || ''}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              vaccination_status: e.target.value,
                            })
                          }
                          placeholder="עדכני / חסר כלבת..."
                        />
                      </div>
                      <div className="edit-field">
                        <label>תיאור</label>
                        <textarea
                          rows={3}
                          value={editData.description || ''}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div
                      className="edit-actions"
                      style={{ padding: '0 24px 24px' }}
                    >
                      <button
                        onClick={handleSave}
                        style={{
                          background: '#06b6d4',
                          color: 'white',
                          padding: '12px 24px',
                          borderRadius: '12px',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <Save size={20} style={{ marginLeft: '8px' }} /> שמור
                        שינויים
                      </button>
                      <button
                        onClick={() => setExpandedId(null)}
                        style={{
                          background: '#e2e8f0',
                          padding: '12px 24px',
                          borderRadius: '12px',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={20} style={{ marginLeft: '8px' }} /> ביטול
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
