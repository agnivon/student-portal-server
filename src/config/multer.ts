// Multer storage configuration
/* const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "temp/uploads/"); // Specify the destination folder for uploaded files
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Set the file name
  },
}); */

import express from "express";
import multer from "multer";

const mimeTypeRegex =
  /^(image\/(jpeg|png|gif|bmp|webp)|application\/(msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)|application\/pdf)$/;

function fileFilter(
  _req: express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted

  // To reject this file pass `false`, like so:
  if (file.size > 1_000_000) {
    return cb(new Error("File size is too large"));
  }

  if (!mimeTypeRegex.test(file.mimetype)) {
    return cb(new Error("File format is unsupported"));
  }

  // To accept the file pass `true`, like so:
  return cb(null, true);

  // You can always pass an error if something goes wrong:
  //cb(new Error("I don't have a clue!"));
}

const storage = multer.memoryStorage();

const multerConfig = { storage, dest: "temp/uploads", fileFilter };

export default multerConfig;
