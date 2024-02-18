"use strict";
// Multer storage configuration
/* const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "temp/uploads/"); // Specify the destination folder for uploaded files
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Set the file name
  },
}); */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const mimeTypeRegex = /^(image\/(jpeg|png|gif|bmp|webp)|application\/(msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)|application\/pdf)$/;
function fileFilter(_req, file, cb) {
    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted
    // To reject this file pass `false`, like so:
    if (file.size > 1000000) {
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
const storage = multer_1.default.memoryStorage();
const multerConfig = { storage, dest: "temp/uploads", fileFilter };
exports.default = multerConfig;
