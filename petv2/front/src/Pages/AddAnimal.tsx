import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../redux/store';
import { useForm } from 'react-hook-form';
import { Animal } from '../Models/Animal';
import { addAnimal } from '../redux/actions/animalActions';
import { resetUpload } from '../redux/reducers/uploadReducer';
import { uploadAnimalImage } from '../redux/actions/uploadActions';
import { fetchFormOptionsData } from '../Api/animalApi';
import { AnimalFormFields } from '../Components/AddAnimal/AnimalFormFields';
import { AnimalImageUploader } from '../Components/AddAnimal/AnimalImageUploader';
import { errorClass } from '../utils/style';
import { AddAnimalData } from '../Models/AddAnimalData';

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
  } = useForm<AddAnimalData>({
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
      is_house_trained: false,
    },
  });
  const [dropdowns, setDropdowns] = useState({
    genders: [],
    sizes: [],
    species: [],
    statuses: [],
    shelters: [],
    breeds: [],
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
        localStorage.setItem('animalFormOptions', JSON.stringify(data));
      } catch (error) {
        console.error('❌ Failed to load dropdown data:', error);
      }
    };
    loadDropdowns();
  }, []);

  // Reset upload state when component unmounts or navigates away
  useEffect(() => {
    return () => {
      dispatch(resetUpload());
      clearImage();
    };
  }, [dispatch]);

  // Update form when image is uploaded successfully
  useEffect(() => {
    if (uploadStatus === 'succeeded' && imageUrl) {
      setValue('image_url', imageUrl);
      console.log('✅ Image URL set in form:', imageUrl);
    }
  }, [uploadStatus, imageUrl, setValue]);

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
  const onSubmit = async (animalData: AddAnimalData) => {
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
      <form onSubmit={handleSubmit(onSubmit)} className="add-animal-form">
        <AnimalFormFields
          register={register}
          errors={errors}
          dropdowns={dropdowns}
        />
        <AnimalImageUploader
          handleImageChange={handleImageChange}
          clearImage={clearImage}
          handleUpload={handleUpload}
          imagePreview={imagePreview}
          uploadStatus={uploadStatus}
          imageUrl={imageUrl}
          uploadError={uploadError}
          uploadProgress={uploadProgress}
          API_URL={API_URL}
        />
        <button
          type="submit"
          className="submit-btn"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'מוסיף...' : '➕ הוסף חיה'}
        </button>
        {error && <p className={errorClass}>{error}</p>}
      </form>
    </div>
  );
}
