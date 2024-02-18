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
const passport_utils_1 = require("../utils/passport.utils");
const mongoose_1 = require("../models/mongoose");
const request_body_1 = require("../schema/validation/request_body");
const response_utils_1 = require("../utils/response.utils");
const postRouter = express_1.default.Router();
postRouter.get("/all", passport_utils_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).send("Unauthorized");
        const userId = req.user.admin_id || req.user._id;
        const posts = yield mongoose_1.Post.find({ user: userId })
            .populate("user", { password: 0 })
            .populate("attachments", { password: 0 })
            .sort({ createdAt: -1 })
            .lean();
        return res.json(posts);
    }
    catch (err) {
        console.log(err);
        const [code, message] = (0, response_utils_1.getErrorMessage)(err);
        return res.status(code).send(message);
    }
}));
postRouter.post("/create", passport_utils_1.ensureAdminAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).send("Unauthorized");
        const formData = request_body_1.NewPostBodySchema.parse(req.body);
        const newPost = yield mongoose_1.Post.create(Object.assign({ user: req.user._id }, formData));
        /* await newPost.populate<{ user: IUser }>("user", { password: 0 });
        await newPost.populate<{ attachments: IFile[] }>("attachments", {
          password: 0,
        }); */
        return res.json(newPost);
    }
    catch (err) {
        console.log(err);
        const [code, message] = (0, response_utils_1.getErrorMessage)(err);
        return res.status(code).send(message);
    }
}));
postRouter.delete("/:id", passport_utils_1.ensureAdminAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).send("Unauthorized");
        const id = req.params.id;
        const deletedPost = yield mongoose_1.Post.findByIdAndDelete(id, {
            returnDocument: "after",
        }).lean();
        return res.json(deletedPost);
    }
    catch (err) {
        console.log(err);
        const [code, message] = (0, response_utils_1.getErrorMessage)(err);
        return res.status(code).send(message);
    }
}));
exports.default = postRouter;
