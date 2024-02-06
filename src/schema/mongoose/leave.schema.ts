import { Schema, Types } from "mongoose";
import { ILeave, ILeaveMethods } from "../../types/leave.types";
import { LeaveModel } from "../../types/mongoose/models.types";

const LeaveSchema = new Schema<ILeave, LeaveModel, ILeaveMethods>(
  {
    student: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    from_date: { type: Date, required: true },
    to_date: { type: Date, required: true },
    reason: { type: String, default: null },
    approved: { type: Schema.Types.Boolean, default: null },
  },
  {
    timestamps: { currentTime: () => Date.now() },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* LeaveSchema.virtual("student", {
  ref: "User",
  localField: "student_id",
  foreignField: "_id",
}); */

export default LeaveSchema;
