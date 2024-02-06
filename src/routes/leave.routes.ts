import express from "express";
import { ZodError } from "zod";
import { Leave, User } from "../models/mongoose";
import {
  ApplyLeaveBodySchema,
  LeaveApprovalBodySchema,
} from "../schema/validation/request_body";
import { IUser } from "../types/user.types";
import {
  ensureAdminAuthenticated,
  ensureUserAuthenticated,
} from "../utils/passport.utils";
import { getErrorMessage } from "../utils/zod.utils";

const leaveRouter = express.Router();

leaveRouter.get("/my-leaves", ensureUserAuthenticated, async (req, res) => {
  try {
    if (!req.user) return res.status(401).send("Unauthorized");

    const leaves = await Leave.find({ student: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(leaves);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
});

leaveRouter.get("/all-leaves", ensureAdminAuthenticated, async (req, res) => {
  try {
    if (!req.user) return res.status(401).send("Unauthorized");

    const adminStudentIds = await User.find({ admin_id: req.user._id })
      .lean()
      .select({ _id: 1 })
      .exec();

    const leaves = await Leave.find({ student: { $in: adminStudentIds } })
      .populate<{
        student: IUser;
      }>("student", { password: 0 })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return res.json(leaves);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
});

leaveRouter.post("/apply", ensureUserAuthenticated, async (req, res) => {
  try {
    if (!req.user) return res.status(401).send("Unauthorized");

    const body = ApplyLeaveBodySchema.parse(req.body);

    const existingLeave = await Leave.exists({
      student: req.user._id,
      approved: { $in: [null, true] },
      $or: [
        { from_date: { $gte: body.from_date, $lte: body.to_date } },
        { to_date: { $gte: body.from_date, $lte: body.to_date } },
        {
          from_date: { $lte: body.from_date },
          to_date: { $gte: body.to_date },
        },
      ],
    });

    if (existingLeave)
      return res
        .status(400)
        .send("New leave cannot overlap with previous leaves");

    const newLeave = await Leave.create({
      student: req.user._id,
      ...body,
    });

    return res.json(newLeave);
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      return res.status(400).send(getErrorMessage(err));
    }
    return res.status(500).send("Internal Server Error");
  }
});

leaveRouter.post(
  "/approval/:id",
  ensureAdminAuthenticated,
  async (req, res) => {
    try {
      if (!req.user) return res.status(401).send("Unauthorized");

      const id = req.params.id;

      const { approved } = LeaveApprovalBodySchema.parse(req.body);

      const leave = await Leave.findById(id);

      if (leave) {
        if (leave.approved !== null)
          return res.status(400).send("Leave already approved/rejected");
        leave.approved = approved;
        leave.save();
        return res.json(leave);
      } else {
        return res.status(400).send(`Leave ${id} not found`);
      }
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        return res.status(400).send(getErrorMessage(err));
      }
      return res.status(500).send("Internal Server Error");
    }
  }
);

leaveRouter.delete("/:id", ensureUserAuthenticated, async (req, res) => {
  try {
    if (!req.user) return res.status(401).send("Unauthorized");
    const id = req.params.id;
    const leave = await Leave.findById(id);

    if (leave) {
      if (leave.approved !== null)
        return res.status(400).send("Leave already approved/rejected");
      await Leave.deleteOne({ _id: id });
      return res.json(leave);
    } else {
      return res.status(400).send(`Leave ${id} not found`);
    }
  } catch {}
});

export default leaveRouter;
