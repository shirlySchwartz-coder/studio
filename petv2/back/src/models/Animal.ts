export class Animal {
  public id: number;
  public name: string;
  public species_id: number;
  public size_id: number;
  public gender_id: number;
  public status_id: number;
  public shelter_id: number;
  public breed_id: number;
  public view_count: number;
  public share_count: number;
  public is_neutered: boolean;
  public is_house_trained: boolean;
  public vaccination_status: string;
  public created_at: Date;
  public updated_at?: Date;
  public age?: number;
  public description?: string;
  public approved_by_user_id?: number;
  public approved_at?: Date;
  public rejection_reason?: string;

  constructor(
    id: number,
    name: string,
    species_id: number,
    size_id: number,
    gender_id: number,
    status_id: number,
    shelter_id: number,
    breed_id: number,
    view_count: number,
    share_count: number,
    is_neutered: boolean,
    is_house_trained: boolean,
    vaccination_status: string,
    created_at: Date,
    updated_at?: Date,
    age?: number,
    description?: string,
    approved_by_user_id?: number,
    approved_at?: Date,
    rejection_reason?: string
  ) {
    this.id = id;
    this.name = name;
    this.species_id = species_id;
    this.size_id = size_id;
    this.gender_id = gender_id;
    this.status_id = status_id;
    this.shelter_id = shelter_id;
    this.breed_id = breed_id;
    this.view_count = view_count;
    this.share_count = share_count;
    this.is_neutered = is_neutered;
    this.is_house_trained = is_house_trained;
    this.vaccination_status = vaccination_status;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.age = age;
    this.description = description;
    this.approved_by_user_id = approved_by_user_id;
    this.approved_at = approved_at;
    this.rejection_reason = rejection_reason;
  }
}
