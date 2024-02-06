import express from "express";
import {
  ensureAdminAuthenticated,
  ensureAuthenticated,
} from "../utils/passport.utils";
import { Post } from "../models/mongoose";
import { NewPostBodySchema } from "../schema/validation/request_body";
import { ZodError } from "zod";
import { getErrorMessage } from "../utils/zod.utils";
import { IUser } from "../types/user.types";
import { IFile } from "../types/file.types";

const postRouter = express.Router();

postRouter.get("/all", ensureAuthenticated, async (req, res) => {
  try {
    if (!req.user) return res.status(401).send("Unauthorized");
    const userId = req.user.admin_id || req.user._id;

    const posts = await Post.find({ user: userId })
      .populate<{ user: IUser }>("user", { password: 0 })
      .populate<{ attachments: IFile[] }>("attachments", { password: 0 })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(posts);
  } catch (err) {
    console.log(err);

    return res.status(500).send("Internal Server Error");
  }
});

postRouter.post("/create", ensureAdminAuthenticated, async (req, res) => {
  try {
    if (!req.user) return res.status(401).send("Unauthorized");
    const formData = NewPostBodySchema.parse(req.body);

    const newPost = await Post.create({
      user: req.user._id,
      ...formData,
    });

    /* await newPost.populate<{ user: IUser }>("user", { password: 0 });
    await newPost.populate<{ attachments: IFile[] }>("attachments", {
      password: 0,
    }); */

    return res.json(newPost);
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      return res.status(400).send(getErrorMessage(err));
    }
    return res.status(500).send("Internal Server Error");
  }
});

postRouter.delete("/:id", ensureAdminAuthenticated, async (req, res) => {
  try {
    if (!req.user) return res.status(401).send("Unauthorized");
    const id = req.params.id;

    const deletedPost = await Post.findByIdAndDelete(id, {
      returnDocument: "after",
    }).lean();

    return res.json(deletedPost);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
});

export default postRouter;
