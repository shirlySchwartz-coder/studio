import { Route, Routes } from 'react-router-dom';
import { Page404 } from '../Pages/Page404';
import { Login } from '../Pages/Login';
import { Home } from '../Pages/Home';
import { Register } from '../Pages/Register';
import { AddAnimal } from '../Pages/AddAnimal/AddAnimal';
import { SearchAnimal } from '../Pages/SearchAnimal';

export default function MainRoute() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/addAnimal" element={<AddAnimal />} />
        <Route path="/searchAnimals" element={<SearchAnimal />} />
        <Route path="/about" element={<h1>About Page</h1>} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}
