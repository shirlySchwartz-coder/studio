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
import { useAuthToken } from '../middleware/authMiddleware';

export function AddAnimal() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.animals);
  const { isLoggedIn, permissions } = useSelector(
    (state: RootState) => state.auth
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
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
    if (!isLoggedIn) {
      navigate('/login');
    } else if (!permissions.includes('can_post_animals')) {
      navigate('/home');
    }
  }, [isLoggedIn, permissions, navigate]);

  const onSubmit = async (animalData: Animal) => {
    dispatch(addAnimal(animalData));
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
          <label>כתובת תמונה</label>
          <input
            {...register('image_url', { required: 'כתובת תמונה נדרשת' })}
            className={inputClass}
          />
          {errors.image_url && (
            <p className={errorClass}>{errors.image_url.message}</p>
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
