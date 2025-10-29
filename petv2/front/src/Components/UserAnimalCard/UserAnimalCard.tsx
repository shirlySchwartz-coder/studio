import React from 'react';
import { Animal } from '../../Models/Animal';
import {
  Gender,
  Shelters,
  Size,
  Species,
  Statuses,
} from '../../Models/ReferenceData';

interface UserAnimalCardProps {
  animal: Animal;
  dropdowns: {
    genders: Gender[];
    sizes: Size[];
    species: Species[];
    statuses: Statuses[];
    shelters: Shelters[];
  };
}

export const UserAnimalCard: React.FC<UserAnimalCardProps> = ({
  animal,
  dropdowns,
}) => {
  console.log('dropdowns:', dropdowns);
  return (
    <>
      <li className="card">
        <img
          src={animal.image_url || '/placeholder-image.png'}
          alt={animal.name}
          loading="lazy"
          className="image"
        />
        <p className="name">:שם {animal.name}</p>
        <p className="detail">:מעמותה {animal.shelter_name}</p>
        <p className="detail">:סוג {animal.species_name}</p>
        <p className="detail">:מין {animal.gender_name}</p>
        <p className="detail">:גודל {animal.size_name}</p>
      </li>
    </>
  );
};
