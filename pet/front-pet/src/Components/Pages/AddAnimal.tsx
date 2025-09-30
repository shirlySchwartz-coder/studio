import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { store } from '../../redux/store';

import { uploadImage } from '../utils/uploadUtils';
import {
  formClass,
  inputClass,
  buttonClass,
  errorClass,
  labelClass,
  textareaClass,
  checkboxClass,
  gridClass,
} from '../utils/styles';
import { containerClass } from '../utils/styles';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { AuthState } from '../../redux/AuthReducer';

export function AddAnimal() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state: AuthState) => state);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const image = formData.get('image') as File | null;
    let image_url = '';
    if (image) {
      try {
        image_url = await uploadImage(image);
      } catch (uploadErr: any) {
        setError(uploadErr.message || 'Failed to upload image.');
        setIsPending(false);
        return;
      }
    }

    const data = {
      name: formData.get('name') as string,
      breed: formData.get('breed') as string,
      species_id: Number(formData.get('species_id')),
      status_id: Number(formData.get('status_id')),
      shelter_id: Number(formData.get('shelter_id')),
      gender_id: Number(formData.get('gender_id')),
      age_months: Number(formData.get('age_months')),
      size_id: Number(formData.get('size_id')),
      description: formData.get('description') as string,
      is_neutered: formData.get('is_neutered') === 'on',
      is_house_trained: formData.get('is_house_trained') === 'on',
      vaccination_status: formData.get('vaccination_status') as string,
      image_url,
    };

    try {
      //await dispatch(addAnimal(data)).unwrap();
      const response = await axios.post(`${API_URL}/animals/addNew`, data, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (response.status !== 201) {
        throw new Error('Failed to add animal');
      } else {
        console.log('Animal added:', response.data);
        navigate('/home');
      }
    } catch (err: any) {
      setError(
        typeof err === 'string' ? err : err.message || 'Failed to add animal'
      );
    } finally {
      setIsPending(false);
    }
  };

  if (!auth.role_id || auth.role_id != 2) {
    return (
      <div className={containerClass}>
        <p className={errorClass}>You do not have permission to add animals.</p>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <h1 className="text-3xl font-bold mb-4">Add New Animal</h1>
      <form onSubmit={handleSubmit} className={formClass}>
        <div className={gridClass}>
          <div>
            <label className={labelClass}>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter animal's name"
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Breed</label>
            <input
              type="text"
              name="breed"
              placeholder="Enter breed (e.g., Labrador)"
              className={inputClass}
              required
            />
          </div>
        </div>
        <div className={gridClass}>
          <div>
            <label className={labelClass}>Gender</label>
            <select name="gender_id" className={inputClass} required>
              <option value="">Select Gender</option>
              <option value="1">Male</option>
              <option value="2">Female</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Species</label>
            <select name="species_id" className={inputClass} required>
              <option value="">Select Species</option>
              <option value="1">Dog</option>
              <option value="2">Cat</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Age (Months)</label>
            <input
              type="number"
              name="age_months"
              placeholder="Enter age in months"
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Size</label>
            <select name="size_id" className={inputClass} required>
              <option value="">Select Size</option>
              <option value="1">Small</option>
              <option value="2">Medium</option>
              <option value="3">Large</option>
            </select>
          </div>
        </div>
        <div className={gridClass}>
          <div>
            <label className={labelClass}>Status</label>
            <select name="status_id" className={inputClass} required>
              <option value="">Select Status</option>
              <option value="1">Available</option>
              <option value="3">Pending</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Shelter ID</label>
            <input
              type="number"
              name="shelter_id"
              placeholder="Enter shelter ID"
              defaultValue="1"
              className={inputClass}
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_neutered"
              className={checkboxClass}
            />
            <label className={labelClass}>Neutered</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_house_trained"
              className={checkboxClass}
            />
            <label className={labelClass}>House Trained</label>
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Vaccination Status</label>
            <input
              type="text"
              name="vaccination_status"
              placeholder="Enter vaccination details"
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            placeholder="Describe the animal (personality, needs, etc.)"
            className={textareaClass}
          />
        </div>
        <div>
          <label className={labelClass}>Upload Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className={inputClass}
          />
        </div>
        <button type="submit" className={buttonClass} disabled={isPending}>
          {isPending ? 'Adding...' : 'Add Animal'}
        </button>
        {error && <p className={errorClass}>{error}</p>}
      </form>
    </div>
  );
}
