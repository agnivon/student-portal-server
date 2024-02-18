"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LeaveSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    from_date: { type: Date, required: true },
    to_date: { type: Date, required: true },
    reason: { type: String, default: null },
    approved: { type: mongoose_1.Schema.Types.Boolean, default: null },
}, {
    timestamps: { currentTime: () => Date.now() },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
/* LeaveSchema.virtual("student", {
  ref: "User",
  localField: "student_id",
  foreignField: "_id",
}); */
exports.default = LeaveSchema;
