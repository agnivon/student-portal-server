import { CallbackError, Schema } from "mongoose";
import { UserModel } from "../../types/mongoose/models.types";
import { IUser, IUserMethods } from "../../types/user.types";
import { comparePassword, hashPassword } from "../../utils/crypto.utils";

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      index: true,
      unique: true,
      default: null,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    password: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
    admin_id: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "User",
    },
    profile_image: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "File",
    }
  },
  {
    timestamps: { currentTime: () => Date.now() },
    //toJSON: { virtuals: true },
    //toObject: { virtuals: true },
  }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  try {
    if (user.password) {
      user.password = await hashPassword(user.password);
      next();
    }
  } catch (error) {
    return next(error as CallbackError);
  }
});

// Mongoose method to compare passwords during authentication

UserSchema.statics.comparePassword = comparePassword;

UserSchema.methods.comparePassword = function (candidatePassword: string) {
  return comparePassword(this.password || "", candidatePassword);
};

UserSchema.methods.isAdmin = function (): boolean {
  try {
    return this.admin_id === null;
  } catch (error) {
    throw error;
  }
};

export default UserSchema;
