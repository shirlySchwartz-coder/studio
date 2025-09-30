import { Animal } from "../Components/Models/Animal";

export class AnimalState{
  public animals: Animal[] = [];
  public status: 'idle' | 'loading' | 'succeeded' | 'failed' = 'idle';
  public error: string | null = null;
}

export interface AnimalAction {
  type: string;
  payload?: any;
}

export function addAnimalsAction(newAnimal: Partial<Animal>) :AnimalAction {
  return { type: 'ADD_ANIMAL', payload: newAnimal };
}
export function getAnimalsAction(animals: Animal[]) :AnimalAction {
  return { type: 'GET_ANIMALS', payload: animals };
}
export function setAnimalsAction(animals: Animal[]) :AnimalAction {
  return { type: 'SET_ANIMALS', payload: animals };
}

export function animalReducer(
  currentState: AnimalState = new AnimalState(), action: AnimalAction): AnimalState {
  let newState = { ...currentState };

  switch (action.type) {
    case 'GET_ANIMALS':
      newState.animals = action.payload;
      newState.status = 'succeeded';
      newState.error = null;
      break;
    case 'ADD_ANIMAL':
      newState.animals = [...newState.animals, action.payload];
      break;
    case 'SET_ANIMALS':
      newState.animals = action.payload;
      newState.status = 'succeeded';
      newState.error = null;
      break;
    default:
      return currentState;
  }
  return newState;
}