export class Animal {
  public id: number;
  public name: string;
  public species_id: number; // ID
  public size_id: number;
  public gender_id: number; // ID
  public status_id: number; // ID
  public shelter_id: number; // ID
  public breed_id: number;
  public age: number;
  public is_neutered: boolean;
  public is_house_trained: boolean;
  public vaccination_status: string;
  public created_at: Date;
  public updated_at?: Date;
  public view_count: number;
  public share_count: number;
  public description?: string;
  public image_url?: string;
  public approved_by_user_id?: number;
  public approved_at?: Date;
  public rejection_reason?: string;

  get species(): string {
    return this.getNameFromRef('species', this.species_id);
  }
  get size(): string {
    return this.getNameFromRef('sizes', this.size_id);
  }
  get gender(): string {
    return this.getNameFromRef('genders', this.gender_id);
  }
  get status(): string {
    return this.getNameFromRef('statuses', this.status_id);
  }
  get shelter(): string {
    return this.getNameFromRef('shelters', this.shelter_id);
  }
  get breed(): string {
    return this.getNameFromRef('breeds', this.breed_id);
  }

  private getNameFromRef(table: string, id: number | undefined): string {
    // כאן תוכלי להזריק referenceData, אבל נעשה בקומפוננטה
    return id ? `פריט ${id}` : 'לא ידוע'; // placeholder – נתקן בקוד
  }

  constructor(data: Partial<Animal>) {
    this.id = data.id || 0;
    this.name = data.name || '';
    this.breed_id = data.breed_id || 0;
    this.species_id = data.species_id || 0;
    this.size_id = data.size_id || 0;
    this.gender_id = data.gender_id || 0;
    this.status_id = data.status_id || 0;
    this.shelter_id = data.shelter_id || 0;
    this.view_count = data.view_count || 0;
    this.share_count = data.share_count || 0;
    this.is_neutered = data.is_neutered || false;
    this.is_house_trained = data.is_house_trained || false;
    this.vaccination_status = data.vaccination_status || '';
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at;
    this.age = data.age || 0;
    this.description = data.description;
    this.image_url = data.image_url || '';
    this.approved_by_user_id = data.approved_by_user_id;
    this.approved_at = data.approved_at;
    this.rejection_reason = data.rejection_reason;
  }
}
