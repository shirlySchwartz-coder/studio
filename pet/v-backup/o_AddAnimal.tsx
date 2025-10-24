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
import { fetchFormOptionsData } from '../Api/animalApi';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export function AddAnimal() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.animals);
  const { isLoggedIn, roleId, token } = useSelector(
    (state: RootState) => state.auth
  );
  // Upload state from Redux
  const {
    imageUrl,
    status: uploadStatus,
    error: uploadError,
  } = useSelector((state: RootState) => state.upload);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
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
      shelter_id: 0,
    },
  });
  const [dropdowns, setDropdowns] = useState({
    genders: [],
    sizes: [],
    species: [],
    statuses: [],
    shelters: [],
  });

  useEffect(() => {
    if (!isLoggedIn || !roleId || roleId > 2) {
      navigate('/login');
    }
  }, [isLoggedIn, roleId, navigate]);

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const data = await fetchFormOptionsData();
        setDropdowns(data);
      } catch (error) {
        console.error('❌ Failed to load dropdown data:', error);
      }
    };
    loadDropdowns();
  }, []);

  // Update form when image is uploaded successfully
  useEffect(() => {
    if (uploadStatus === 'succeeded' && imageUrl) {
      setValue('image_url', imageUrl);
      console.log('✅ Image URL set in form:', imageUrl);
    }
  }, [uploadStatus, imageUrl, setValue]);

  // Reset upload state when component unmounts or navigates away
  useEffect(() => {
    return () => {
      dispatch(resetUpload());
      clearImage();
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

  // Clear image and reset upload state
  const clearImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setUploadProgress(0);
    setValue('image_url', '');
    dispatch(resetUpload());

    // Clear file input
    const fileInput = document.getElementById(
      'image-input'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Handle image upload via Redux
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('אנא בחר תמונה תחילה');
      return;
    }

    if (!token) {
      alert('אינך מחובר. אנא התחבר מחדש.');
      navigate('/login');
      return;
    }

    try {
      setUploadProgress(0);
      const result = await dispatch(
        uploadAnimalImage({ file: selectedFile, token })
      ).unwrap();

      console.log('✅ Upload completed, image URL:', result);
      setUploadProgress(100);
    } catch (error: any) {
      console.error('❌ Upload failed:', error);
      setUploadProgress(0);
    }
  };

  // Simulate upload progress (since we don't have real progress tracking)
  useEffect(() => {
    if (uploadStatus === 'loading') {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [uploadStatus]);

  // Handle form submission
  const onSubmit = async (animalData: Animal) => {
    try {
      console.log('📤 Submitting animal data:', animalData);

      await dispatch(addAnimal(animalData)).unwrap();
      alert('החיה נוספה בהצלחה!');

      // Reset form and clear image
      reset();
      clearImage();

      navigate('/home');
    } catch (error) {
      console.error('❌ Error adding animal:', error);
    }
  };

  return (
    <div className="add-animal-form">
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
            {dropdowns.species.map((specie: any) => (
              <option key={specie.id} value={specie.id}>
                {specie.name}
              </option>
            ))}
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
            {dropdowns.genders.map((gender: any) => (
              <option key={gender.id} value={gender.id}>
                {gender.name}
              </option>
            ))}
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
            {dropdowns.sizes.map((size: any) => (
              <option key={size.id} value={size.id}>
                {size.name}
              </option>
            ))}
          </select>
          {errors.size_id && (
            <p className={errorClass}>{errors.size_id.message}</p>
          )}
        </div>
        <div className={labelClass}>
          <label>הגיע מעמותה</label>
          <select
            {...register('shelter_id', { required: 'שם עמותה חובה' })}
            className={inputClass}
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
            id="image-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={inputClass}
          />
          {imagePreview && (
            <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="תצוגה מקדימה"
                  className="max-w-xs Prev-Image mx-auto rounded-lg shadow-md"
                />
                {/* Clear Image Button */}
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 text-sm"
                >
                  ✕ מחק תמונה
                </button>
              </div>

              {/* Upload Progress Bar */}
              {uploadStatus === 'loading' && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    מעלה... {uploadProgress}%
                  </p>
                </div>
              )}

              {/* Upload Button */}
              {!imageUrl && uploadStatus !== 'loading' && (
                <button
                  type="button"
                  onClick={handleUpload}
                  className={buttonClass + ' mt-4 w-full'}
                >
                  📤 אשר והעלה תמונה
                </button>
              )}

              {/* Upload Success */}
              {uploadStatus === 'succeeded' && imageUrl && (
                <div className="mt-4">
                  <p className="text-green-600 font-semibold text-center">
                    ✅ תמונה הועלתה בהצלחה!
                  </p>
                  {process.env.NODE_ENV === 'development' && (
                    <p className="text-xs text-gray-500 text-center mt-2 break-all">
                      {API_URL}
                      {imageUrl}
                    </p>
                  )}
                </div>
              )}
              {/* Upload Error */}
              {uploadError && (
                <p className={errorClass + ' mt-4 text-center'}>
                  {uploadError}
                </p>
              )}
            </div>
          )}
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className={buttonClass + ' mt-6'}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'מוסיף...' : '➕ הוסף חיה'}
        </button>

        {error && <p className={errorClass}>{error}</p>}
      </form>
    </div>
  );
}
