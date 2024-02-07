import { Types } from "mongoose";

export type IVerificationType = "forgot-password" | "registration";

export type IVerification = {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  active: boolean;
  type: IVerificationType | null;
  expiryAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type IVerificationMethods = {};
