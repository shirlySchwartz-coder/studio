export interface JwtPayload {
  userId: number;
  fullName: string;
  roleId: number;
  shelterId?: number;
  exp?: number;
}