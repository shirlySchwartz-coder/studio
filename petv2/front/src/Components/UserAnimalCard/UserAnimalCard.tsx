import React, { useEffect, useState } from 'react';
import { Animal } from '../../Models/Animal';
import { Heart } from 'lucide-react';
import { Button } from '../Ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Redux/store';
import {
  addToFavorites,
  removeFromFavorites,
  fetchFavoritesCount,
} from '../../Redux/actions/favoriteAction';
import { useNavigate } from 'react-router';

interface UserAnimalCardProps {
  animal: Animal;
}

export const UserAnimalCard: React.FC<UserAnimalCardProps> = ({ animal }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { favoritesCount, status, favoriteIds } = useSelector(
    (state: RootState) => state.favorites
  );
  const [loadingHeart, setLoadingHeart] = useState(false);

  const navigate = useNavigate();

  const defaultImageDog = `http://localhost:8080/uploads/animals/dog.jpeg`;
  const defaultImageCat = `http://localhost:8080/uploads/animals/cat.jpeg`;
  const primaryImage =
    animal.images?.[0] ||
    (animal.species === 'כלב' ? defaultImageDog : defaultImageCat);

  const isFavorite = favoriteIds.includes(animal.id);
  // פונקציית טוגל ללב
  const toggleFavorite = async () => {
    if (!isLoggedIn) {
      alert('You must be logged in to add to favorites');
      return;
    }
    setLoadingHeart(true);
    if (isFavorite) {
      const result = await dispatch(removeFromFavorites(animal.id));
      if (removeFromFavorites.fulfilled.match(result)) {
        dispatch(fetchFavoritesCount());
      }
    } else {
      if (favoritesCount <= 10) {
        const result = await dispatch(addToFavorites(animal.id));
        if (addToFavorites.fulfilled.match(result)) {
          dispatch(fetchFavoritesCount());
        }
      } else {
        alert(
          'הגעת למקסימום המועדפים המותרים (5). הסר חיה ממועדפים כדי להוסיף חדשה.'
        );
      }
    }
    setLoadingHeart(false);
  };
  const getAnimalDetails = (id: number) => {
    return () => {
      
      navigate(`/animals/${animal.id}`);
    };
  };

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
        <button
          className="pet-card-heart"
          onClick={toggleFavorite}
          disabled={loadingHeart || status === 'loading'}
          title={isFavorite ? 'הסר ממועדפים' : 'הוסף למועדפים'}
        >
          {loadingHeart ? (
            '⟳'
          ) : (
            <span style={{ fontSize: '24px' }}>{isFavorite ? '❤️' : '🤍'}</span>
          )}
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
        <button className="btn-primary" style={{ width: '100%' }} 
        onClick={getAnimalDetails(animal.id)}>
          צפה בפרטים ✨
        </button>
      </div>
    </div>
  );
};
