import { Date, Schema, Types } from "mongoose";

export type IUser = {
  _id: Types.ObjectId;
  first_name: string;
  last_name: string;
  username: string | null;
  email: string;
  password: string | null;
  phone: string | null;
  is_active: boolean;
  admin_id: Schema.Types.ObjectId | null;
  profile_image: Schema.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
};
export type IUserMethods = {
  isAdmin: () => boolean;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
};
