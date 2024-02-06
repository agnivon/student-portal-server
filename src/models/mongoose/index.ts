import mongoose from "mongoose";
import FileSchema from "../../schema/mongoose/file.schema";
import LeaveSchema from "../../schema/mongoose/leave.schema";
import PostSchema from "../../schema/mongoose/post.schema";
import UserSchema from "../../schema/mongoose/user.schema";
import VerificationSchema from "../../schema/mongoose/verification.schema";
import { IFile } from "../../types/file.types";
import { ILeave } from "../../types/leave.types";
import {
  FileModel,
  LeaveModel,
  PostModel,
  UserModel,
  VerificationModel,
} from "../../types/mongoose/models.types";
import { IPost } from "../../types/post.types";
import { IUser } from "../../types/user.types";
import { IVerification } from "../../types/verification.types";

export const User = mongoose.model<IUser, UserModel>("User", UserSchema);

export const File = mongoose.model<IFile, FileModel>("File", FileSchema);

export const Post = mongoose.model<IPost, PostModel>("Post", PostSchema);

export const Leave = mongoose.model<ILeave, LeaveModel>("Leave", LeaveSchema);

export const Verification = mongoose.model<IVerification, VerificationModel>(
  "Verification",
  VerificationSchema
);
