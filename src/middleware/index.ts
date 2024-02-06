import cors from "cors";
import express, { Express } from "express";
import passportMiddleware from "./passport";
import sessionMiddleware from "./session";

export default function middleware(app: Express) {
  app.use(cors({ origin: process.env.CLIENT_HOST, credentials: true }));
  app.use("/public", express.static(process.cwd() + "/public"));
  app.use(express.json()); // for parsing application/json
  app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  sessionMiddleware(app);
  passportMiddleware(app);
}
