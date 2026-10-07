import type { RequestHandler } from "express";
import type { Role } from "../../constants/roles";
import { userRepository } from "../../repositories/user.repository";
import { InvalidTokenError, verifyToken } from "../../utils/jwt";
import { HttpError } from "../error/error-handler";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; name: string; email: string; role: Role };
    }
  }
}

export const authenticate: RequestHandler = async (req, _res, next) => {
  try {
    const token = req.header("authorization")?.match(/^Bearer (.+)$/i)?.[1];
    if (!token) throw new HttpError(401, "Authentication required");
    const userId = verifyToken(token);
    const user = await userRepository.findPublicById(userId);
    if (!user) throw new HttpError(401, "Account not found");
    req.user = user;
    next();
  } catch (error) {
    next(
      error instanceof InvalidTokenError
        ? new HttpError(401, error.message)
        : error,
    );
  }
};
