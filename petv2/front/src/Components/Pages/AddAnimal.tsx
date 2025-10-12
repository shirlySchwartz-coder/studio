import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../redux/store';
import { useForm } from 'react-hook-form';
import {
  containerClass,
  formClass,
  inputClass,
  buttonClass,
  errorClass,
  labelClass,
} from '../utils/style';
import { Animal } from '../Models/Animal';
import { addAnimal } from '../../redux/actions/animalActions';
import axios from 'axios';
import { resetUpload } from '../../redux/reducers/uploadReducer';
import { uploadAnimalImage } from '../../redux/actions/uploadActions';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export function AddAnimal() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.animals);
  const { isLoggedIn, roleId, token } = useSelector(
    (state: RootState) => state.auth
  );
  // Animal state from Redux
  const { status: animalStatus, error: animalError } = useSelector(
    (state: RootState) => state.animals
  );

  // Upload state from Redux
  const {
    imageUrl,
    status: uploadStatus,
    error: uploadError,
  } = useSelector((state: RootState) => state.upload);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Animal>({
    defaultValues: {
      name: '',
      breed: '',
      species_id: 0,
      gender_id: 0,
      size_id: 0,
      is_neutered: false,
      vaccination_status: '',
      description: '',
      image_url: '',
    },
  });

  useEffect(() => {
    if (!isLoggedIn || !roleId || roleId > 2) {
      navigate('/login');
    }
  }, [isLoggedIn, roleId, navigate]);

  // Update form when image is uploaded successfully
  useEffect(() => {
    if (uploadStatus === 'succeeded' && imageUrl) {
      setValue('image_url', imageUrl);
    }
  }, [uploadStatus, imageUrl, setValue]);

  // Reset upload state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetUpload());
    };
  }, [dispatch]);

  // Handle image file selection and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate file type
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!validTypes.includes(file.type)) {
      alert('אנא בחר קובץ תמונה תקין (JPG, PNG, GIF, WEBP)');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert('גודל התמונה חייב להיות קטן מ-5MB');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle image upload via Redux
  const handleUpload = () => {
    if (!selectedFile) {
      alert('אנא בחר תמונה תחילה');
      return;
    }

    if (!token) {
      alert('אינך מחובר. אנא התחבר מחדש.');
      navigate('/login');
      return;
    }

    dispatch(uploadAnimalImage({ file: selectedFile, token }));
  };

  // Handle form submission
  const onSubmit = async (animalData: Animal) => {
    if (!animalData.image_url) {
      alert('אנא העלה תמונה לפני שמירת החיה');
      return;
    }

    try {
      await dispatch(addAnimal(animalData)).unwrap();
      alert('החיה נוספה בהצלחה!');
      navigate('/home');
    } catch (error) {
      console.error('Error adding animal:', error);
    }
  };

  return (
    <div className={containerClass}>
      <h1 className="text-3xl font-bold mb-4">הוספת חיה חדשה</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={formClass}>
        <div className={labelClass}>
          <label>שם</label>
          <input
            {...register('name', { required: 'שם החיה נדרש' })}
            className={inputClass}
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>
        <div className={labelClass}>
          <label>גזע</label>
          <input
            {...register('breed', { required: 'גזע החיה נדרש' })}
            className={inputClass}
          />
          {errors.breed && <p className={errorClass}>{errors.breed.message}</p>}
        </div>
        <div className={labelClass}>
          <label>מין</label>
          <select
            {...register('species_id', { required: 'מין החיה נדרש' })}
            className={inputClass}
          >
            <option value="">בחר מין</option>
            <option value="1">כלב</option>
            <option value="2">חתול</option>
          </select>
          {errors.species_id && (
            <p className={errorClass}>{errors.species_id.message}</p>
          )}
        </div>
        <div className={labelClass}>
          <label>מגדר</label>
          <select
            {...register('gender_id', { required: 'מגדר החיה נדרש' })}
            className={inputClass}
          >
            <option value="">בחר מגדר</option>
            <option value="1">זכר</option>
            <option value="2">נקבה</option>
          </select>
          {errors.gender_id && (
            <p className={errorClass}>{errors.gender_id.message}</p>
          )}
        </div>
        <div className={labelClass}>
          <label>גודל</label>
          <select
            {...register('size_id', { required: 'גודל החיה נדרש' })}
            className={inputClass}
          >
            <option value="">בחר גודל</option>
            <option value="1">קטן</option>
            <option value="2">בינוני</option>
            <option value="3">גדול</option>
          </select>
          {errors.size_id && (
            <p className={errorClass}>{errors.size_id.message}</p>
          )}
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('is_neutered')}
            className={inputClass}
          />
          <label className={labelClass}>מסורס</label>
        </div>
        <div className={labelClass}>
          <label>סטטוס חיסונים</label>
          <input
            {...register('vaccination_status', {
              required: 'סטטוס חיסונים נדרש',
            })}
            className={inputClass}
          />
          {errors.vaccination_status && (
            <p className={errorClass}>{errors.vaccination_status.message}</p>
          )}
        </div>
        <div className={labelClass}>
          <label>תיאור</label>
          <textarea
            {...register('description', { required: 'תיאור החיה נדרש' })}
            className={inputClass}
          />
          {errors.description && (
            <p className={errorClass}>{errors.description.message}</p>
          )}
        </div>
        <div className={labelClass}>
          <label> תמונה</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={inputClass}
          />
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="תצוגה מקדימה"
                className="max-w-xs Prev-Image"
              />
              <button
                type="button"
                onClick={handleUpload}
                className={buttonClass + ' mt-2'}
                disabled={uploadStatus === 'loading'}
              >
                {uploadStatus === 'loading' ? 'מעלה...' : 'אשר והעלה תמונה'}
              </button>
            </div>
          )}
          {uploadError && <p className={errorClass}>{uploadError}</p>}
          {uploadStatus === 'succeeded' && (
            <p className="text-green-500">תמונה הועלתה בהצלחה!</p>
          )}
        </div>
        <button
          type="submit"
          className={buttonClass}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'מוסיף...' : 'הוסף חיה'}
        </button>
        {error && <p className={errorClass}>{error}</p>}
      </form>
    </div>
  );
}
