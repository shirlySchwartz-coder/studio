import { ChevronDown, Search } from 'lucide-react';
import {
  Breeds,
  Gender,
  ReferenceData,
  Size,
  Species,
} from '../../Models/ReferenceData';

interface SearchBarProps {
  genders: Gender[];
  sizes: Size[];
  species: Species[];
  breeds: Breeds[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  genders,
  sizes,
  species,
  breeds,
}) => {
  console.log(' props:', genders, sizes, species, breeds);
  return (
    <section className="search-section">
      <div className="search-container">
        <div className="search-header">
          <h3 className="search-title">מצא את החבר המושלם 🔍</h3>
          <p className="search-subtitle">
            השתמש בפילטרים כדי למצוא בדיוק מה שאתה מחפש
          </p>
        </div>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
        >
          <div className="search-input-wrapper">
            <Search className="search-input-icon" size={24} />
            <input
              type="text"
              placeholder="חפש חיה לפי סוג / עיר / גזע... 🐶🐱"
            />
          </div>

          <div className="search-filters">
            <div className="relative">
              <select className="input-base appearance-none cursor-pointer">
                <option>סוג החיה</option>
                {species.map((specie) => (
                  <option key={specie.id}>{specie.name}</option>
                ))}
              </select>
              <ChevronDown
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--blue-gray)' }}
              />
            </div>

            <div className="relative">
              <select className="input-base appearance-none cursor-pointer">
                <option>גודל</option>
                {sizes.map((size) => (
                  <option key={size.id}>{size.name}</option>
                ))}
              </select>
              <ChevronDown
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--blue-gray)' }}
              />
            </div>

            <div className="relative">
              <select className="input-base appearance-none cursor-pointer">
                <option>מגדר</option>
                {genders.map((gender) => (
                  <option key={gender.id}>{gender.name}</option>
                ))}
              </select>
              <ChevronDown
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--blue-gray)' }}
              />
            </div>

            <div className="relative">
              <select className="input-base appearance-none cursor-pointer">
                <option>גזע</option>
                {breeds.map((breed) => (
                  <option key={breed.id}>{breed.name}</option>
                ))}
              </select>
              <ChevronDown
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--blue-gray)' }}
              />
            </div>
          </div>
          <button
            className="btn-primary btn-search"
            style={{ background: 'var(--cyan)', color: 'var(--white)' }}
          >
            חפש
          </button>
        </div>
      </div>
    </section>
  );
};
