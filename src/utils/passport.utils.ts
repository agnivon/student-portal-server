import { RequestHandler } from "express";

export const ensureAuthenticated: RequestHandler = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).send("Forbidden");
};

export const ensureAdminAuthenticated: RequestHandler = function (
  req,
  res,
  next
) {
  if (req.isAuthenticated() && req.user.admin_id === null) {
    return next();
  }
  return res.status(401).send("Forbidden");
};

export const ensureUserAuthenticated: RequestHandler = function (
  req,
  res,
  next
) {
  if (req.isAuthenticated() && req.user.admin_id !== null) {
    return next();
  }
  return res.status(401).send("Forbidden");
};
