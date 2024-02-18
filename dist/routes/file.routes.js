"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const file_1 = __importDefault(require("../clients/file"));
const multer_2 = __importDefault(require("../config/multer"));
const mongoose_1 = require("../models/mongoose");
const passport_utils_1 = require("../utils/passport.utils");
const response_utils_1 = require("../utils/response.utils");
const upload = (0, multer_1.default)(multer_2.default);
const fileRouter = express_1.default.Router();
const fileClient = file_1.default.getInstance();
fileRouter.post("/upload", passport_utils_1.ensureAdminAuthenticated, upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.file) {
            //console.log(req.file, req.file.buffer);
            const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
            const uploadId = yield fileClient.upload(blob);
            const newFile = yield mongoose_1.File.create({
                _id: uploadId,
                name: req.file.originalname,
                mimetype: req.file.mimetype,
            });
            return res.status(201).json(newFile);
        }
        else {
            return res.status(400).send("File not provided");
        }
    }
    catch (err) {
        console.log(err);
        const [code, message] = (0, response_utils_1.getErrorMessage)(err);
        return res.status(code).send(message);
    }
}));
fileRouter.get("/:id", passport_utils_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const file = yield mongoose_1.File.findById(id);
        const fileBuffer = yield fileClient.getFile(id);
        if (fileBuffer && file) {
            //console.log(fileBuffer);
            res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`); // Set the desired filename
            res.setHeader("Content-Type", file.mimetype || "");
            return res.send(Buffer.from(fileBuffer));
        }
        else {
            return res.status(404).send("File not found");
        }
    }
    catch (err) {
        console.log(err);
        const [code, message] = (0, response_utils_1.getErrorMessage)(err);
        return res.status(code).send(message);
    }
}));
fileRouter.delete("/:id", passport_utils_1.ensureAdminAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).send("Unauthorized");
        const file = yield mongoose_1.File.findByIdAndDelete(req.params.id, {
            returnDocument: "after",
        }).lean();
        return res.json(file);
    }
    catch (err) {
        console.log(err);
        const [code, message] = (0, response_utils_1.getErrorMessage)(err);
        return res.status(code).send(message);
    }
}));
exports.default = fileRouter;
