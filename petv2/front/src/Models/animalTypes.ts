// ========================================
// ANIMAL TYPES
// ========================================

/**
 * Generic Animal Data - can be used for create/edit/full entity
 * All fields are optional except those required for creation
 */
export interface AnimalData {
    // Identity
    id?: number;
    
    // Basic Info (required for creation)
    name: string;
    species_id: number | string;
    breed_id: number | string;
   
    
    // Physical Attributes (required for creation)
    gender_id: number | string;
    size_id: number | string;
    age?: number;
    
    // Health & Status (required for creation)
    is_neutered?: boolean;
    vaccination_status?: string;
    status_id?: number | string;
    
    // Details
    description?: string;
    image_url?: string;
    
    // Location & Metadata (auto-generated, read-only)
    shelter_id?: number;
    view_count?: number;
    created_at?: string;
    updated_at?: string;
  }
  
  /**
   * Full Animal entity from database (all fields present)
   */
  export interface Animal extends Required<Omit<AnimalData, 'breed_id' | 'age'>> {
    id: number;
    species_id: number;
    gender_id: number;
    size_id: number;
    status_id: number;
    shelter_id: number;
    is_neutered: boolean;
    breed_id?: number;
    age?: number;
  }
  
  /**
   * Animal creation payload (subset of AnimalData)
   */
  export interface AnimalCreate {
    name: string;
    species_id: string;
    breed: string;
    gender_id: string;
    size_id: string;
    is_neutered: boolean;
    vaccination_status: string;
    description: string;
    image_url: string;
  }
  
  /**
   * Animal edit payload (id required + any fields to update)
   */
  export interface AnimalEdit {
    id: number;
    name?: string;
    species_id?: number;
    breed?: string;
    breed_id?: number;
    gender_id?: number;
    size_id?: number;
    age?: number;
    is_neutered?: boolean;
    vaccination_status?: string;
    status_id?: number;
    description?: string;
    image_url?: string;
  }
  
 