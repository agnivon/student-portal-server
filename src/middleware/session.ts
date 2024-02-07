import session, { MemoryStore } from "express-session";
import { Express } from "express";
import assert from "assert";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import { isProduction } from "../utils/env.utils";

export default function sessionMiddleware(app: Express) {
  const secret = process.env.SESSION_SECRET;
  assert(secret, new Error("SESSION_SECRET not defined"));
  const options = {
    secret: process.env.SESSION_SECRET as string,
    resave: true,
    key: "express.sid",
    unset: "destroy" as const,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      collectionName: "sessions",
      stringify: false,
      ttl: 14 * 24 * 60 * 60, // = 14 days
    }),
    saveUninitialized: true,
    cookie: {
      secure: isProduction(),
      sameSite: isProduction() ? ("none" as const) : undefined,
      path: "/",
      httpOnly: true,
      partitioned: true,
    },
  };
  app.use(session(options));
}
