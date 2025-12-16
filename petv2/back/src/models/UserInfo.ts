export interface UserPayload {
  userId: number;
  fullName: string;
  roleId: number;
  shelterId: number;
}

import { Request } from 'express';
export interface AuthRequest extends Request {
  user?: UserPayload;
}
