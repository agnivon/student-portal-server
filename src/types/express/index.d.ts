// src/types/express/index.d.ts

import { IUser } from "../user.types";

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface User extends Omit<IUser, "password"> {}
  }
}
