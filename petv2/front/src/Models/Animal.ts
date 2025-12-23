export interface AnimalBase {
  name: string;
  species_id: number;
  breed_id?: number;
  gender_id: number;
  size_id: number;
  status_id: number;
  shelter_id?: number;
  age?: number;
  is_neutered: boolean;
  is_house_trained: boolean;
  vaccination_status: string;
  description?: string;
  image_url?: string;
  view_count?: number;
  share_count?: number;
  approved_by_user_id?: number;
  approved_at?: string;
  rejection_reason?: string;
  created_at?: string;
  updated_at?: string;
  images?: string[];

  grooming_level?: string;
  living_conditions?: string;
  good_with_children?: string;
  good_with_other_animals?: string;
}

export interface Animal extends AnimalBase {
  id: number;
  species?: string;
  breed?: string;
  gender?: string;
  size?: string;
  status?: string;
  shelter?: string;
}

export interface AnimalCreate extends AnimalBase {}

export interface AnimalEdit extends Partial<AnimalBase> {
  id: number;
}

export interface AnimalFormData extends AnimalBase {
  id?: number;
}
