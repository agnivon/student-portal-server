import { ZodError } from "zod";

export function getErrorMessage(err: ZodError) {
  return err.errors.map((e) => e.message).join(",");
}
