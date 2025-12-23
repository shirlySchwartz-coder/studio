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
    const {
      selectedAnimal,
      status: animalStatus,
      error,
    } = useSelector((state: RootState) => state.animals);
    const { isLoggedIn } = useSelector((state: RootState) => state.auth);
    const { favoriteIds, favoritesCount, status: favoritesStatus } = useSelector((state: RootState) => state.favorites);
    
    console.log('    selectedAnimal:' ,selectedAnimal)
    const animalId = Number(id);
    const isFavorite = favoriteIds.includes(animalId);

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
        selectedAnimal?.images?.[0] ||
      (selectedAnimal?.species === 'כלב'
        ? 'http://localhost:8080/uploads/animals/dog.jpeg'
        : 'http://localhost:8080/uploads/animals/cat.jpeg');
    
        if(animalStatus === 'loading' || !selectedAnimal) {
            return (
    <div className="container max-w-4xl mx-auto py-20 text-center">
      <p className="text-2xl">טוען פרטי חיה...</p>
    </div>
  );
}
if(animalStatus === 'failed') {
  return (
    <div className="container max-w-4xl mx-auto py-20 text-center">
      <p className="text-2xl text-red-600">שגיאה בטעינת החיה</p>
      <button onClick={() => navigate(-1)} className="mt-4 text-blue-600">
        ← חזור
      </button>
    </div>
    );
}

    return (
    <div>
        <h1>{selectedAnimal.name}</h1>
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
            alt={selectedAnimal.name}
            className="w-full rounded-lg shadow-lg object-cover h-96"
          />
          {selectedAnimal.images && selectedAnimal.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {selectedAnimal.images.map((img: string, index: number) => (
                <img
                  key={index}
                  src={img}
                  alt={`${selectedAnimal.name} ${index + 1}`}
                  className="rounded shadow cursor-pointer hover:opacity-80 h-24 object-cover"
                />
              ))}
            </div>
          )}
        </div>

        {/* פרטים */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{selectedAnimal.name} ❤️</h1>

          <div className="space-y-3 text-lg">
            <p>
              <span className="font-semibold">עמותה:</span> {selectedAnimal.shelter}
            </p>
            <p>
              <span className="font-semibold">גזע:</span> {selectedAnimal.breed}
            </p>
            <p>
              <span className="font-semibold">סוג:</span> {selectedAnimal.species}
            </p>
            <p>
              <span className="font-semibold">מין:</span> {selectedAnimal.gender}
            </p>
            <p>
              <span className="font-semibold">גיל:</span> {selectedAnimal.age}
            </p>
            <p>
              <span className="font-semibold">גודל:</span> {selectedAnimal.size}
            </p>
            <p>
              <span className="font-semibold">מצב:</span>
              <span
                className={
                  selectedAnimal.status === 'דחוף'
                    ? 'text-red-600 font-bold'
                    : 'text-green-600'
                }
              >
                {' '}
                {selectedAnimal.status}
              </span>
            </p>
            {selectedAnimal.description && (
              <p className="mt-6">
                <span className="font-semibold">תיאור:</span>
                <br /> {selectedAnimal.description}
              </p>
            )}
            <p><span className="font-semibold">רמת טיפוח:</span> {selectedAnimal.grooming_level || 'לא צוין'}</p>
            <p><span className="font-semibold">תנאי מחיה:</span> {selectedAnimal.living_conditions || 'לא צוין'}</p>
            <p><span className="font-semibold">מסתדר עם ילדים:</span> {selectedAnimal.good_with_children ? 'כן' : 'לא'}</p>
            <p><span className="font-semibold">מסתדר עם חיות אחרות:</span> {selectedAnimal.good_with_other_animals ? 'כן' : 'לא'}</p>
            <p><span className="font-semibold">מחוסן:</span> {selectedAnimal.vaccination_status || 'לא ידוע'}</p>
            <p><span className="font-semibold">מעוקר/מסורס:</span> {selectedAnimal.is_neutered ? 'כן' : 'לא'}</p>

            {selectedAnimal.description && (
              <p className="mt-6">
                <span className="font-semibold">תיאור:</span><br />
                {selectedAnimal.description}
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
