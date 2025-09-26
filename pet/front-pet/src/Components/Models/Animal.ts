export  class Animal {
    public id: number;
    public name!: string;
    public species_id!: number;
    public breed?: string;
    public gender_id!: number;
    public age_months?: number;
    public size_id?: number;
    public description?: string;
    public image_url?: string;
    public status_id!: number;
    public shelter_id!: number;
    public approved_by_user_id?: number;
    public approved_at?: Date;
    public rejection_reason?: string;
    public view_count!: number;
    public share_count!: number;
    public is_neutered!: boolean;
    public is_house_trained!: boolean;
    public vaccination_status!: string;
    public created_at!: Date;
    public updated_at!: Date;

  constructor(
    id: number,
    name: string,
    species_id: number,
    breed: string | undefined,
    gender_id: number,
    age_months: number | undefined,
    size_id: number | undefined,
    description: string | undefined,
    image_url: string | undefined,
    status_id: number,
    shelter_id: number,
    approved_by_user_id: number | undefined,
    approved_at: Date | undefined,
    rejection_reason: string | undefined,
    view_count: number,
    share_count: number,
    is_neutered: boolean,
    is_house_trained: boolean,
    vaccination_status: string,
    created_at: Date,
    updated_at: Date   
  ) {
    this.id = id;
    this.name = name;
    this.species_id = species_id;
    this.breed = breed; 
    this.gender_id = gender_id;
    this.age_months = age_months;
    this.size_id = size_id;
    this.description = description;
    this.image_url = image_url;
    this.status_id = status_id;
    this.shelter_id = shelter_id;
    this.approved_by_user_id = approved_by_user_id;
    this.approved_at = approved_at;
    this.rejection_reason = rejection_reason;
    this.view_count = view_count;
    this.share_count = share_count;
    this.is_neutered = is_neutered;
    this.is_house_trained = is_house_trained;
    this.vaccination_status = vaccination_status;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
    
    

