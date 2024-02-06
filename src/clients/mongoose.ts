import assert from "assert";
import mongoose, { Mongoose } from "mongoose";

export default function connect(callback: (m: Mongoose) => void) {
  const MONGODB_URI = process.env.MONGODB_URI;
  assert(MONGODB_URI, new Error("MONGODB_URI not defined"));
  return mongoose.connect(MONGODB_URI).then(callback);
}
