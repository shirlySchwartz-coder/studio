import React from 'react';
import { Animal } from '../../Models/Animal';
import styles from '../AnimalCard/AnimalCard.module.css';
import { Heart } from 'lucide-react';
import { Button } from '../Ui/button';

interface UserAnimalCardProps {
  animal: Animal;
}

export const UserAnimalCard: React.FC<UserAnimalCardProps> = ({ animal }) => {
  const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const defaultImageDog = `http://localhost:8080/uploads/animals/max-1764147437538-291335760.webp`;
  const defaultImageCat = `http://localhost:8080/uploads/animals/max-1764147437538-291335760.webp`;

  return (
    <div className="pet-card">
      <div className="pet-card-image">
        <img
          src={
            animal.image_url ||
            (animal.species === 'כלב' ? defaultImageDog : defaultImageCat)
          }
          alt={animal.name}
          loading="lazy"
          className={styles.image}
          onError={(e) => {
            console.log('Image load error:', e);
            // Fallback to generic default if image fails to load
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
          <p className={styles.detail}>עמותה: {animal.shelter}</p>
          <p className={styles.detail}>גזע: {animal.breed}</p>
          <p className={styles.detail}>סוג: {animal.species}</p>
          <p className={styles.detail}>מין: {animal.gender}</p>
          <p className={styles.detail}>גודל: {animal.size}</p>
        </div>
        <Button className="btn-primary" style={{ width: '100%' }}>
          צפה בפרטים ✨
        </Button>
      </div>
    </div>
  );
};
