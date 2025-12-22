import { Routes, Route } from 'react-router-dom';
import { Page404 } from '../Pages/Page404';
import { Login } from '../Pages/Login';
import { Register } from '../Pages/Register';
import { AddAnimal } from '../Pages/AddAnimal';
import { SearchAnimal } from '../Pages/SearchAnimal';
import DashPage from '../Pages/DashPage';
import HomePage from '../Pages/HomePage';
import AnimalDetailsPage from '../Components/AnimalDetailsPage';

export default function MainRoute() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dash" element={<DashPage />} />
        <Route path="/addAnimal" element={<AddAnimal />} />
        <Route path="/searchAnimals" element={<SearchAnimal />} />
        <Route path="/about" element={<h1>About Page</h1>} />
        <Route path="/animal/:id" element={<AnimalDetailsPage />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}
