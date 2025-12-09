// src/components/Dash/AnimalEditModal.tsx
import { useState, useEffect } from 'react';
import { X, Save, Upload } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Redux/store';
import { updateAnimal } from '../../Redux/actions/animalActions';
import { toast } from 'sonner';
import { AnimalEditData } from '../../Models/AnimalEditData';
import { Animal } from '../../Models/Animal';

interface AnimalEditModalProps {
  animal: Animal;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AnimalEditModal({
  animal,
  isOpen,
  onClose,
  onSuccess,
}: AnimalEditModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { referenceData } = useSelector((state: RootState) => state.animals);
  const [data, setData] = useState<Partial<Animal>>({});
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (animal) {
      setData(animal);
      setPreview(animal.image_url || null);
    }
  }, [animal]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        setPreview(url);
        setData((prev) => ({ ...prev, image_url: url }));
      };
      reader.readAsDataURL(file);
    }
  };

  const save = async () => {
    const res = await dispatch(
      updateAnimal({ ...data, id: animal.id } as Animal)
    );
    if (updateAnimal.fulfilled.match(res)) {
      toast.success('החיה עודכנה בהצלחה!');
      onSuccess?.();
      onClose();
    }
  };

  if (!isOpen || !animal) return null;

  const opt = (key: keyof typeof referenceData) =>
    referenceData[key]?.map((i) => (
      <option key={i.id} value={i.id}>
        {i.name}
      </option>
    ));

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">עריכת חיה: {animal.name}</h2>
          <button onClick={onClose} className="modal-close">
            <X size={28} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-image-upload">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="modal-image-preview"
              />
            ) : (
              <div className="text-gray-400">אין תמונה</div>
            )}
            <label className="modal-upload-btn">
              <Upload size={20} /> העלאת תמונה
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                hidden
              />
            </label>
          </div>

          <div className="modal-field">
            <label>שם</label>
            <input
              value={data.name || ''}
              onChange={(e) => setData((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="modal-field">
            <label>גיל</label>
            <input
              type="number"
              value={data.age || ''}
              onChange={(e) => setData((p) => ({ ...p, age: +e.target.value }))}
            />
          </div>
          <div className="modal-field">
            <label>מין</label>
            <select
              value={data.gender_id || ''}
              onChange={(e) =>
                setData((p) => ({ ...p, gender_id: +e.target.value }))
              }
            >
              <option value="">בחר מין</option>
              {opt('genders')}
            </select>
          </div>
          <div className="modal-field">
            <label>גודל</label>
            <select
              value={data.size_id }
              onChange={(e) =>
                setData((p) => ({ ...p, size_id: +e.target.value }))
              }
            >
              <option value="">בחר גודל</option>
              {opt('sizes')}
            </select>
          </div>
          <div className="modal-field">
            <label>סוג</label>
            <select
              value={data.species_id }
              onChange={(e) =>
                setData((p) => ({ ...p, species_id: +e.target.value }))
              }
            >
              <option value="">בחר סוג</option>
              {opt('species')}
            </select>
          </div>
          <div className="modal-field">
            <label>גזע</label>
            <select
              value={data.breed_id}
              onChange={(e) =>
                setData((p) => ({
                  ...p,
                  breed_id: +e.target.value || undefined,
                }))
              }
            >
              <option value="">בחר גזע</option>
              {opt('breeds')}
            </select>
          </div>
          <div className="modal-field">
            <label>סטטוס</label>
            <select
              value={data.status_id }
              onChange={(e) =>
                setData((p) => ({ ...p, status_id: +e.target.value }))
              }
            >
              <option value="">בחר סטטוס</option>
              {opt('statuses')}
            </select>
          </div>
          <div className="modal-field">
            <label>מצב חיסונים</label>
            <input
              value={data.vaccination_status }
              onChange={(e) =>
                setData((p) => ({ ...p, vaccination_status: e.target.value }))
              }
              placeholder="עדכני / חסר כלבת..."
            />
          </div>
          <div className="modal-field" style={{ gridColumn: '1 / -1' }}>
            <label>תיאור</label>
            <textarea
              rows={5}
              value={data.description}
              onChange={(e) =>
                setData((p) => ({ ...p, description: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-cancel">
            ביטול
          </button>
          <button onClick={save} className="btn-save">
            <Save size={20} /> שמור
          </button>
        </div>
      </div>
    </div>
  );
}
