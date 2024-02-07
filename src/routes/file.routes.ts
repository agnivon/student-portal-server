import { AxiosError } from "axios";
import express from "express";
import multer from "multer";
import FileClient from "../clients/file";
import multerConfig from "../config/multer";
import { File } from "../models/mongoose";
import {
  ensureAdminAuthenticated,
  ensureAuthenticated,
} from "../utils/passport.utils";
import { getErrorMessage } from "../utils/response.utils";

const upload = multer(multerConfig);

const fileRouter = express.Router();

const fileClient = FileClient.getInstance();

fileRouter.post(
  "/upload",
  ensureAdminAuthenticated,
  upload.single("file"),
  async (req, res) => {
    try {
      if (req.file) {
        //console.log(req.file, req.file.buffer);
        const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
        const uploadId = await fileClient.upload(blob);
        const newFile = await File.create({
          _id: uploadId,
          name: req.file.originalname,
          mimetype: req.file.mimetype,
        });
        return res.status(201).json(newFile);
      } else {
        return res.status(400).send("File not provided");
      }
    } catch (err) {
      console.log(err);

      const [code, message] = getErrorMessage(err);
      return res.status(code).send(message);
    }
  }
);

fileRouter.get("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const id = req.params.id;

    const file = await File.findById(id);

    const fileBuffer: ArrayBuffer = await fileClient.getFile(id);

    if (fileBuffer && file) {
      //console.log(fileBuffer);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file.name}"`
      ); // Set the desired filename
      res.setHeader("Content-Type", file.mimetype || "");
      return res.send(Buffer.from(fileBuffer));
    } else {
      return res.status(404).send("File not found");
    }
  } catch (err) {
    console.log(err);
    const [code, message] = getErrorMessage(err);
    return res.status(code).send(message);
  }
});

fileRouter.delete("/:id", ensureAdminAuthenticated, async (req, res) => {
  try {
    if (!req.user) return res.status(401).send("Unauthorized");

    const file = await File.findByIdAndDelete(req.params.id, {
      returnDocument: "after",
    }).lean();

    return res.json(file);
  } catch (err) {
    console.log(err);
    const [code, message] = getErrorMessage(err);
    return res.status(code).send(message);
  }
});

export default fileRouter;
