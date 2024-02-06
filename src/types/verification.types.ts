import { Types } from "mongoose";

export type IVerification = {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  active: boolean;
  expiryAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type IVerificationMethods = {};
