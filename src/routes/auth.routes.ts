import express, { NextFunction, Request, Response } from "express";
import passport, { AuthenticateCallback } from "passport";
import { removeFields } from "../utils/object.utils";

const authRouter = express.Router();

const authenticateCallback =
  (req: Request, res: Response, next: NextFunction): AuthenticateCallback =>
  (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).send((info as { message: string }).message);
      }

      req.login(user, (err) => {
        if (err) return next(err);
        return res.json(removeFields(user, ["password"]));
      });
    } catch (err) {
      return next(err);
    }
  };

authRouter.post(
  "/login",
  // passport.authenticate("local"),
  // (req, res) => {
  //   if (!req.user) return res.status(401).send("Unauthorized");
  //   return res.status(200).json(removeFields(req.user, ["password"]));
  // }
  (req, res, next) =>
    passport.authenticate("local", authenticateCallback(req, res, next))(
      req,
      res,
      next
    )
);

authRouter.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send("Internal Server Error");
    else return res.status(204).send();
  });
});

export default authRouter;
