export interface Size {
  id: number;
  name: string;
}

export interface Gender {
  id: number;
  name: string;
}

export interface Species {
  id: number;
  name: string;
}
export interface Statuses {
  id: number;
  name: string;
}
export interface Shelters {
  id: number;
  name: string;
}
export interface Breeds {
  id: number;
  name: string;
}

export interface ReferenceData {
  sizes: Size[];
  genders: Gender[];
    species: Species[];
     statuses: Statuses[],
  shelters: Shelters[],
  breeds: Breeds[],
}