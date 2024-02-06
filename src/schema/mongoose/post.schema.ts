import { Schema, Types } from "mongoose";
import { PostModel } from "../../types/mongoose/models.types";
import { IPost, IPostMethods } from "../../types/post.types";

const PostSchema = new Schema<IPost, PostModel, IPostMethods>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    title: { type: String, required: true },
    content: { type: String, required: true },
    attachments: {
      type: [{ type: Schema.Types.ObjectId, ref: "File" }],
      default: [],
    },
  },
  { timestamps: { currentTime: () => Date.now() } }
);

export default PostSchema;
