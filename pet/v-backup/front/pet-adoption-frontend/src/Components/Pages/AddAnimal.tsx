import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
export function AddAnimal() {
  const [newAnimal, setNewAnimal] = useState({
    name: '',
    breed: '',
    species_id: 1,
  });
  const { register } = useForm();

  const handleAddAnimal: SubmitHandler<any> = (data) => {
    console.log(data);
  };
  return (
    <div>
      {/*  <h1>Add Animal Page</h1>
      <form onSubmit={handelSubmit(handleAddAnimal)}></form> */}
    </div>
  );
}
