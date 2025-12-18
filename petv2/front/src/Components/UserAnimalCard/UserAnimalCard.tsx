import React from 'react';
import { Animal } from '../../Models/Animal';
import { Heart } from 'lucide-react';
import { Button } from '../Ui/button';

interface UserAnimalCardProps {
  animal: Animal;
}

export const UserAnimalCard: React.FC<UserAnimalCardProps> = ({ animal }) => {
  const defaultImageDog = `http://localhost:8080/uploads/animals/dog.jpeg`;
  const defaultImageCat = `http://localhost:8080/uploads/animals/cat.jpeg`;
  const primaryImage =
    animal.images?.[0] ||
    (animal.species === 'כלב' ? defaultImageDog : defaultImageCat);

  return (
    <div className="pet-card">
      <div className="pet-card-image">
        <img
          src={primaryImage}
          alt={animal.name}
          loading="lazy"
          className="image"
          onError={(e) => {
            console.log('Image load error:', e);
            // Fallback to generic default if even primary fails
            e.currentTarget.src =
              animal.species === 'כלב' ? defaultImageDog : defaultImageCat;
          }}
        />
        <button className="pet-card-heart">
          <Heart className="text-orange-400" size={22} />
        </button>
        <div
          className={
            animal.status === 'דחוף'
              ? 'pet-card-badge urgent'
              : 'pet-card-badge available'
          }
        >
          {animal.status}
        </div>
      </div>
      <div className="pet-card-content">
        <h3 className="pet-card-title"> {animal.name} ❤️</h3>
        <div className="pet-card-details">
          <p className="detail">עמותה: {animal.shelter}</p>
          <p className="detail">גזע: {animal.breed}</p>
          <p className="detail">סוג: {animal.species}</p>
          <p className="detail">מין: {animal.gender}</p>
          <p className="detail">גודל: {animal.size}</p>
        </div>
        <Button className="btn-primary" style={{ width: '100%' }}>
          צפה בפרטים ✨
        </Button>
      </div>
    </div>
  );
};
