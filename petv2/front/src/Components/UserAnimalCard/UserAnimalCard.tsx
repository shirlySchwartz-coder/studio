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
        <div>
          <img
            src={animal.image_url || '/placeholder-image.png'}
            alt={animal.name}
            className="image"
          />
        </div>
        <div>
          <p>:שם {animal.name}</p>
        </div>
        <div>
          <p>:מעמותה {animal.shelter_name}</p>
        </div>
        <div>
          <p>:סוג {animal.species_name}</p>
        </div>
        <div>
          <p>:מין {animal.gender_name}</p>
        </div>
        <div>
          <p>:גודל {animal.size_name}</p>
        </div>
      </li>
    </>
  );
};
