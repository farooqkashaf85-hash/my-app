import { Request } from "express";

export type UserRole = "user" | "admin";

export interface AuthUser {
  id: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface JwtPayload {
  user: AuthUser;
}

export interface NoteInput {
  Title: string;
  Content: string;
}