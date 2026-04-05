import { JwtPayloadType } from "../interfaces/jwtPayload.interface";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadType;
    }
  }
}

export {};