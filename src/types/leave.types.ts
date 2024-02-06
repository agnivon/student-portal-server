import { Date, Types } from "mongoose";
import { IUser } from "./user.types";

export type ILeave = {
  _id: Types.ObjectId;
  student: Types.ObjectId;
  from_date: Date;
  to_date: Date;
  reason: string | null;
  approved: boolean | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ILeaveMethods = {};

export type ILeaveVirtuals = {};
