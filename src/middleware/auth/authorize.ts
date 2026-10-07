import type { RequestHandler } from "express";
import { ROLES } from "../../constants/roles";
import { HttpError } from "../error/error-handler";

export const authorizeAdmin: RequestHandler = (req, _res, next) => {
  next(
    req.user?.role === ROLES.ADMIN
      ? undefined
      : new HttpError(403, "Admin access required"),
  );
};

export const authorizeEmployee: RequestHandler = (req, _res, next) => {
  next(
    req.user?.role === ROLES.EMPLOYEE
      ? undefined
      : new HttpError(403, "Employee access required"),
  );
};
