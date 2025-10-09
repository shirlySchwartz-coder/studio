export interface Animal {
  id: number;
  name: string;
  breed: string;
  species_id: number;
  gender_id: number;
  size_id: number;
  is_neutered: boolean;
  vaccination_status: string;
  description: string;
  image_url: string;
  status_id: number;
  shelter_id: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface AnimalCreate {
  name: string;
  breed: string;
  species_id: string;
  gender_id: string;
  size_id: string;
  is_neutered: boolean;
  vaccination_status: string;
  description: string;
  image_url: string;
}