export interface AnimalEditData {
  id: number;
  name: string;
  age: number;
  gender_id: number;
  status_id: number;
  species_id: number;
  size_id: number;
  breed_id?: number;
  vaccination_status?: string;
  description?: string;
  image_url?: string;
}
