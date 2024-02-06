import { Types } from "mongoose";

export type IPost = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  title: string;
  content: string;
  attachments: Types.Array<Types.ObjectId>;
  createdAt: Date;
  updatedAt: Date;
};

export type IPostMethods = {};
