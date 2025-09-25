// src/context/AnimalsProvider.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

const AnimalsContext = createContext<
  | {
      animals: any[];
      setAnimals: (animals: any[]) => void;
    }
  | undefined
>(undefined);

export function AnimalsProvider({ children }: { children: ReactNode }) {
  const [animals, setAnimals] = useState<any[]>([]);

  return (
    <AnimalsContext.Provider value={{ animals, setAnimals }}>
      {children}
    </AnimalsContext.Provider>
  );
}

export function useAnimals() {
  const context = useContext(AnimalsContext);
  if (context === undefined) {
    throw new Error('useAnimals must be used within an AnimalsProvider');
  }
  return context;
}
