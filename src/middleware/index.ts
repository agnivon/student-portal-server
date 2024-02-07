import express, { Express } from "express";
import corsMiddleware from "./cors";
import passportMiddleware from "./passport";
import sessionMiddleware from "./session";
import morgan from "morgan";
import { isDev } from "../utils/env.utils";

export default function middleware(app: Express) {
  corsMiddleware(app);
  app.use("/public", express.static(process.cwd() + "/public"));
  app.use(express.json()); // for parsing application/json
  app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  app.use(morgan(isDev() ? "dev" : "short"));

  sessionMiddleware(app);
  passportMiddleware(app);
}
