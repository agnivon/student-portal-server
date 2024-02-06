import { Types } from "mongoose";

export type IFile = {
  _id: string;
  name: string;
  link: string | null;
  mimetype: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type IFileMethods = {};
