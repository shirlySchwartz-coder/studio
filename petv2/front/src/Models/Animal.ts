export class Animal {
  public id: number;
  public name!: string;
  public species: string;
  public size?: string;
  public gender!: string;
  public status!: string;
  public shelter!: string;
  public view_count!: number;
  public share_count!: number;
  public is_neutered!: boolean;
  public is_house_trained!: boolean;
  public vaccination_status!: string;
  public created_at!: Date;
  public updated_at!: Date;
  public breed?: string;
  public age?: number;
  public description?: string;
  public image_url?: string;
  public approved_by_user_id?: number;
  public approved_at?: Date;
  public rejection_reason?: string;

  constructor(
    id: number,
    name: string,
    species: string,
    size: string,
    gender: string,
    status: string,
    shelter: string,
    view_count: number,
    share_count: number,
    is_neutered: boolean,
    is_house_trained: boolean,
    vaccination_status: string,
    created_at: Date,
    updated_at: Date,
    breed?: string,
    age?: number,
    description?: string,
    image_url?: string,
    approved_by_user_id?: number,
    approved_at?: Date,
    rejection_reason?: string
  ) {
    this.id = id;
    this.name = name;
    this.species = species;
    this.gender = gender;
    this.status = status;
    this.shelter = shelter;
    this.view_count = view_count;
    this.share_count = share_count;
    this.is_neutered = is_neutered;
    this.is_house_trained = is_house_trained;
    this.vaccination_status = vaccination_status;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.breed = breed;
    this.age = age;
    this.size = size;
    this.description = description;
    this.image_url = image_url;
    this.approved_by_user_id = approved_by_user_id;
    this.approved_at = approved_at;
    this.rejection_reason = rejection_reason;
  }
}