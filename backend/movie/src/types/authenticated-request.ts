import type {Request} from "express";

export interface AuthenticatedRequest extends Request {
  memberId: number;
}
