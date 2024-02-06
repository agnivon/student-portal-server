import { Express } from "express";
import userRouter from "./user.routes";
import authRouter from "./auth.routes";
import fileRouter from "./file.routes";
import postRouter from "./post.route";
import leaveRouter from "./leave.routes";

export default function routes(app: Express) {
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/file", fileRouter);
  app.use("/post", postRouter);
  app.use("/leave", leaveRouter);
}
