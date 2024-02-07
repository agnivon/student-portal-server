import { AxiosError } from "axios";
import { MongooseError } from "mongoose";
import { ZodError } from "zod";

export function getErrorMessage(err: unknown): [number, string] {
  if (err instanceof ZodError) {
    return [400, err.errors.map((e) => e.message).join(",")];
  }
  if (err instanceof AxiosError) {
    return [500, err.response?.data];
  }
  if (err instanceof MongooseError) {
    return [500, err.message];
  }
  if (err instanceof Error) {
    return [500, err.message];
  }
  return [500, "Internal Server Error"];
}
