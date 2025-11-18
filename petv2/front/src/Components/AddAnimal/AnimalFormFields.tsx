import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Animal } from '../../Models/Animal';
import { inputClass, labelClass, errorClass } from '../../utils/style';
import {
  Breeds,
  Gender,
  Shelters,
  Size,
  Species,
  Statuses,
} from '../../Models/ReferenceData';
import { AddAnimalData } from '../../Models/AddAnimalData';

interface Props {
  register: UseFormRegister<AddAnimalData>;
  errors: FieldErrors<AddAnimalData>;
  dropdowns: {
    genders: Gender[];
    sizes: Size[];
    species: Species[];
    statuses: Statuses[];
    shelters: Shelters[];
    breeds: Breeds[];
  };
}

export const AnimalFormFields: React.FC<Props> = ({
  register,
  errors,
  dropdowns,
}) => {
  return (
    <div className="form-section">
      <div className="form-group">
        <label>שם</label>
        <input
          {...register('name', { required: 'שם החיה נדרש' })}
          className="p-3 border rounded-lg"
        />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>
      <div className="form-group">
        <label>הגיע מעמותה</label>
        <select
          {...register('shelter_id', { required: 'שם עמותה חובה' })}
          className="p-3 border rounded-lg"
        >
          <option value="">בחר עמותה</option>
          {dropdowns.shelters.map((shelter: any) => (
            <option key={shelter.id} value={shelter.id}>
              {shelter.name}
            </option>
          ))}
        </select>
        {errors.shelter_id && (
          <p className={errorClass}>{errors.shelter_id.message}</p>
        )}
      </div>
      <div className="form-group">
        <label>סוג</label>
        <select
          {...register('species_id', { required: 'סוג החיה נדרש' })}
          className="p-3 border rounded-lg"
        >
          <option value="">בחר סוג</option>
          {dropdowns.species.map((s: any) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        {errors.species_id && (
          <p className={errorClass}>{errors.species_id.message}</p>
        )}
      </div>
      <div className="form-group">
        <label>מגדר</label>
        <select
          {...register('gender_id', { required: 'מגדר החיה נדרש' })}
          className="p-3 border rounded-lg"
        >
          <option value="">בחר מגדר</option>
          {dropdowns.genders.map((g: any) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        {errors.gender_id && (
          <p className={errorClass}>{errors.gender_id.message}</p>
        )}
      </div>
      <div className="form-group">
        <label>גודל</label>
        <select
          {...register('size_id', { required: 'גודל החיה נדרש' })}
          className="p-3 border rounded-lg"
        >
          <option value="">בחר גודל</option>
          {dropdowns.sizes.map((s: any) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        {errors.size_id && (
          <p className={errorClass}>{errors.size_id.message}</p>
        )}
      </div>
      <div className="form-group">
        <label>גזע</label>
        <select
          {...register('breed_id', { required: 'גזע החיה נדרש' })}
          className="p-3 border rounded-lg"
        >
          <option value="">בחר גזע</option>
          {dropdowns.breeds.map((b: any) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        {errors.breed_id && (
          <p className={errorClass}>{errors.breed_id.message}</p>
        )}
      </div>
      <hr />

      <h2>מידע רפואי חיוני</h2>
      <div className="space-y-3">
        <div className="checkbox-group">
          <input
            type="checkbox"
            {...register('is_neutered')}
            className={inputClass}
          />
          <label>מאולף בצרכים</label>
        </div>
        <div className="checkbox-group">
          <input
            type="checkbox"
            {...register('is_house_trained')}
            className={inputClass}
          />
          <label>מסורס</label>
        </div>
      </div>

      <div className="form-group">
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

      <div className="form-group">
        <label>תיאור</label>
        <textarea
          {...register('description', { required: 'תיאור החיה נדרש' })}
          className="p-3 border rounded-lg resize-none"
          rows={2}
          placeholder="תיאור"
        />
        {errors.description && (
          <p className={errorClass}>{errors.description.message}</p>
        )}
      </div>
    </div>
  );
};
