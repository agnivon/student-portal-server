import { Schema } from "mongoose";
import { IFile, IFileMethods } from "../../types/file.types";
import { FileModel } from "../../types/mongoose/models.types";

const FileSchema = new Schema<IFile, FileModel, IFileMethods>(
  {
    _id: String,
    name: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: null,
    },
    mimetype: {
      type: String,
      default: null,
    },
  },
  { timestamps: { currentTime: () => Date.now() } }
);

export default FileSchema;
