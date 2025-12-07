import { useEffect, useState } from 'react';
import { Hero } from '../Components/Hero/Hero';
import { SearchBar } from '../Components/SearchBar/SearchBar';
import { List } from '../Components/List';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../Redux/store';
import {
  getAllAnimals,
  getReferenceData,
} from '../Redux/actions/animalActions';
import { loadReferenceData } from '../utils/referenceDataUtils';
import { ReferenceData } from '../Models/ReferenceData';
import { fetchReferenceData } from '../Api/animalApi';

export const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(true);
  const {
    animals,
    referenceData,
    status: animalsStatus,
  } = useSelector((state: RootState) => state.animals);

  useEffect(() => {
    if (!localStorage.getItem('referenceData')) {
      dispatch(getReferenceData());
    }
  }, [dispatch, referenceData]);

  useEffect(() => {
    if (animals.length === 0) dispatch(getAllAnimals());
  }, [dispatch, animals.length]);

  if (animalsStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1>טוען את הנתונים...</h1>
      </div>
    );
  }

  return (
    <>
      <Hero />
      <SearchBar
        sizes={referenceData.sizes}
        genders={referenceData.genders}
        species={referenceData.species}
        breeds={referenceData.breeds}
      />
      <List />
    </>
  );
};

export default HomePage;
