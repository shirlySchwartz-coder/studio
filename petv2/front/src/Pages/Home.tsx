import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAnimals } from '../redux/actions/animalActions';
import { AppDispatch, RootState } from '../redux/store';
import { containerClass, errorClass } from '../utils/style';
import AnimalCard from '../Components/AnimalCard/AnimalCard';
import { List } from '../Components/List';

export function Home() {
  return (
    <div className={containerClass}>
      <List />
    </div>
  );
}
