import { Schema } from "mongoose";
import {
  IVerification,
  IVerificationMethods,
} from "../../types/verification.types";
import { VerificationModel } from "../../types/mongoose/models.types";

const VerificationSchema = new Schema<
  IVerification,
  VerificationModel,
  IVerificationMethods
>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    active: {
      type: Boolean,
      default: true,
    },
    expiryAt: {
      type: Date,
      default: function () {
        return new Date(+new Date() + 15 * 60 * 1000); // 15 minutes from now
      },
    },
  },
  { timestamps: { currentTime: () => Date.now() } }
);

export default VerificationSchema;
