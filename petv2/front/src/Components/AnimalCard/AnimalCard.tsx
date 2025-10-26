import { Animal } from '../../Models/Animal';
import styles from './AnimalCard.module.css';

interface AnimalCardProps {
  animal: Animal & { image_url?: string | null };
}

const AnimalCard: React.FC<AnimalCardProps> = ({ animal }) => {
  const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  // Fallback image if none provided
  const placeholderImageDog = `${apiBaseUrl}/api/uploads/Dog.jpeg`;
  const placeholderImageCat = `${apiBaseUrl}api/uploads/Cat.webp`;
  const placeholderImageError =
    'data:image/jpeg;base64,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';
  console.log(animal);
  return (
    <>
      <li className={styles.card}>
        <img
          src={
            animal.image_url
              ? `${apiBaseUrl}${animal.image_url.startsWith('/') ? '' : '/'}${
                  animal.image_url
                }` // Ensure absolute URL
              : animal.species_name === 'Dog'
              ? placeholderImageDog
              : placeholderImageCat
          }
          alt={`Photo of ${animal.name}, a ${
            animal.species_name === 'Dog' ? 'Dog' : 'Cat'
          }`}
          className={styles.image}
          loading="lazy"
          onError={(e) => {
            console.log('Image load error:', e);
            // Fallback to generic placeholder if image fails to load
            e.currentTarget.src = placeholderImageError;
          }}
        />
        <h2 className={styles.name}>{animal.name}</h2>
        <p className={styles.detail}>גזע: {animal.breed}</p>
        <p className={styles.detail}>מין: {animal.species_name}</p>
        <p className={styles.detail}>מגדר: {animal.gender_name}</p>
        <p className={styles.detail}>גודל: {animal.size_name}</p>
      </li>
    </>
  );
};

export default AnimalCard;
