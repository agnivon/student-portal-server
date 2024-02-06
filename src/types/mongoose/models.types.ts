import { Model } from "mongoose";
import { IUser, IUserMethods } from "../user.types";
import { comparePassword } from "../../utils/crypto.utils";
import { IFile, IFileMethods } from "../file.types";
import { IPost, IPostMethods } from "../post.types";
import { ILeave, ILeaveMethods, ILeaveVirtuals } from "../leave.types";
import { IVerification, IVerificationMethods } from "../verification.types";

export interface UserModel extends Model<IUser, {}, IUserMethods> {
  comparePassword: typeof comparePassword;
}

export interface FileModel extends Model<IFile, {}, IFileMethods> {}

export interface PostModel extends Model<IPost, {}, IPostMethods> {}

export interface LeaveModel
  extends Model<ILeave, {}, ILeaveMethods, ILeaveVirtuals> {}

export interface VerificationModel
  extends Model<IVerification, {}, IVerificationMethods> {}
