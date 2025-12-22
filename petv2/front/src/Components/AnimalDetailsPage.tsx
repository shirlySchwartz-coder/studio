import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../Redux/store";
import { Button } from "./Ui/button";
import { useEffect } from "react";
import { addToFavorites, fetchFavoritesCount, removeFromFavorites } from "../Redux/actions/favoriteAction";
import { fetchAnimalById } from "../Redux/actions/animalActions";

export const AnimalDetailsPage: React.FC =  ()=> {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const animal = useSelector((state: RootState) => state.animals.selectedAnimal);
    const { isLoggedIn } = useSelector((state: RootState) => state.auth);
    const { favoriteIds, favoritesCount, status: favoritesStatus } = useSelector((state: RootState) => state.favorites);
    
    const animalId = Number(id);
    const isFavorite = favoriteIds.has(animalId);

    useEffect(() => {
        if (animalId) {
            dispatch(fetchAnimalById(animalId));
        }
    }, [dispatch, animalId]);

    const toggleFavorite = async () => {
        if (!isLoggedIn) {
            alert('You must be logged in to add to favorites');
            return;
        }
        if (isFavorite) {
            await dispatch(removeFromFavorites(animalId));
        } else {
            if (favoritesCount >= 10) {
                alert('הגעת למקסימום המועדפים המותרים (10). הסר חיה ממועדפים כדי להוסיף חדשה.');
                return;
            }
            await dispatch(addToFavorites(animalId));
        }
        dispatch(fetchFavoritesCount());
    };

    const primaryImage =
      animal.images?.[0] ||
      (animal.species === 'כלב'
        ? 'http://localhost:8080/uploads/animals/dog.jpeg'
        : 'http://localhost:8080/uploads/animals/cat.jpeg');
    
  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← חזור
      </button>
      <div className="grid md:grid-cols-2 gap-8">
        {/* תמונות */}
        <div>
          <img
            src={primaryImage}
            alt={animal.name}
            className="w-full rounded-lg shadow-lg object-cover h-96"
          />
          {animal.images && animal.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {animal.images.map((img: string, index: number) => (
                <img
                  key={index}
                  src={img}
                  alt={`${animal.name} ${index + 1}`}
                  className="rounded shadow cursor-pointer hover:opacity-80 h-24 object-cover"
                />
              ))}
            </div>
          )}
        </div>

        {/* פרטים */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{animal.name} ❤️</h1>

          <div className="space-y-3 text-lg">
            <p>
              <span className="font-semibold">עמותה:</span> {animal.shelter}
            </p>
            <p>
              <span className="font-semibold">גזע:</span> {animal.breed}
            </p>
            <p>
              <span className="font-semibold">סוג:</span> {animal.species}
            </p>
            <p>
              <span className="font-semibold">מין:</span> {animal.gender}
            </p>
            <p>
              <span className="font-semibold">גיל:</span> {animal.age}
            </p>
            <p>
              <span className="font-semibold">גודל:</span> {animal.size}
            </p>
            <p>
              <span className="font-semibold">מצב:</span>
              <span
                className={
                  animal.status === 'דחוף'
                    ? 'text-red-600 font-bold'
                    : 'text-green-600'
                }
              >
                {' '}
                {animal.status}
              </span>
            </p>
            {animal.description && (
              <p className="mt-6">
                <span className="font-semibold">תיאור:</span>
                <br /> {animal.description}
              </p>
            )}
          </div>

          {/* כפתור מועדפים */}
          {isLoggedIn && (
            <Button
              onClick={toggleFavorite}
              className="mt-8 w-full py-6 text-xl"
              disabled={favoritesStatus === 'loading'}
            >
              {favoritesStatus === 'loading' ? (
                'טוען...'
              ) : (
                <>
                  <span className="text-3xl mr-3">
                    {isFavorite ? '❤️' : '🤍'}
                  </span>
                  {isFavorite ? 'הסר ממועדפים' : 'הוסף למועדפים'}
                </>
              )}
            </Button>
          )}

          <Button className="mt-4 w-full bg-green-600 hover:bg-green-700">
            צור קשר עם העמותה 📞
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AnimalDetailsPage
