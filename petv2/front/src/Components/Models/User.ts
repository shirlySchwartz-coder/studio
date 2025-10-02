export class User {
  public id!: number;
  public full_name!: string;
  public email!: string;
  public password_hash!: string;
  public role_id!: number;
  public is_active!: number;
  public created_at!: Date;
  public updated_at!: Date;
  public phone?: string;
  public city?: string;

  constructor(
    id: number,
    full_name: string,
    email: string,
    password_hash: string,
    role_id: number,
    is_active: number,
    created_at: Date,
    updated_at: Date,
    phone?: string,
    city?: string,
  ) {
    this.id = id;
    this.full_name = full_name;
    this.email = email;
    this.password_hash = password_hash;
    this.role_id = role_id;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.phone = phone;
    this.city = city;
  }
}