import session, { MemoryStore } from "express-session";
import { Express } from "express";
import assert from "assert";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";

export default function sessionMiddleware(app: Express) {
  const secret = process.env.SESSION_SECRET;
  assert(secret, new Error("SESSION_SECRET not defined"));
  const options = {
    secret: process.env.SESSION_SECRET as string,
    resave: true,
    key: "express.sid",
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      collectionName: "sessions",
      stringify: false,
      ttl: 14 * 24 * 60 * 60, // = 14 days
    }),
    sameSite: "none",
    path: "/",
    httpOnly: true,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV !== "development" },
  };
  app.use(session(options));
}
