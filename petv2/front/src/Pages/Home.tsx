import { containerClass, errorClass } from '../utils/style';
import { List } from '../Components/List';
import { Hero } from '../Components/Hero/Hero';
import { SearchBar } from '../Components/SearchBar/SearchBar';
import { useEffect, useState } from 'react';
import { fetchFormOptionsData } from '../Api/animalApi';
import { ReferenceData } from '../Models/ReferenceData';

export const Home = () => {
  const [filters, setFilters] = useState<ReferenceData>({
    genders: [],
    sizes: [],
    species: [],
    statuses: [],
    shelters: [],
    breeds: [],
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const cached = localStorage.getItem('animalFormOptions');
        if (cached) {
          setFilters(JSON.parse(cached));
          setLoading(false);
          return;
        }
        const data = await fetchFormOptionsData();
        console.log(data);
        setFilters(data);
        localStorage.setItem('animalFormOptions', JSON.stringify(data));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching form options data:', error);
      }
    };

    loadFilters();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('animalFormOptions');
      localStorage.removeItem('animals');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    // ניקוי המאזין כאשר הקומפוננטה נהרסת (cleanup function)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">טוען... 🐾</div>
      </div>
    );
  }

  return (
    <>
      <Hero />
      <SearchBar
        genders={filters.genders}
        sizes={filters.sizes}
        species={filters.species}
        breeds={filters.breeds}
      />
      <List />
    </>
  );
};
