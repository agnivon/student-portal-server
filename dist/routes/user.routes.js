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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const email_1 = __importDefault(require("../clients/email"));
const file_1 = __importDefault(require("../clients/file"));
const multer_2 = __importDefault(require("../config/multer"));
const register_1 = __importDefault(require("../emails/register"));
const verification_1 = __importDefault(require("../emails/verification"));
const mongoose_1 = require("../models/mongoose");
const request_body_1 = require("../schema/validation/request_body");
const crypto_utils_1 = require("../utils/crypto.utils");
const object_utils_1 = require("../utils/object.utils");
const passport_utils_1 = require("../utils/passport.utils");
const response_utils_1 = require("../utils/response.utils");
const EMAIL_FROM = process.env.EMAIL_FROM;
const upload = (0, multer_1.default)(multer_2.default);
const userRouter = express_1.default.Router();
const emailClient = email_1.default.getInstance();
const fileClient = file_1.default.getInstance();
userRouter.get("/", passport_utils_1.ensureAuthenticated, (req, res) => {
    if (!req.user)
        return res.status(401).send("Unauthorized");
    return res.status(200).json((0, object_utils_1.removeFields)(req.user, ["password"]));
});
userRouter.get("/my-students", passport_utils_1.ensureAdminAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).send("Unauthorized");
        const users = yield mongoose_1.User.find({ admin_id: req.user._id })
            .select({ password: 0 })
            .sort({ createdAt: -1 })
            .lean();
        return res.json(users);
    }
    catch (err) {
        console.log(err);
        const [code, message] = (0, response_utils_1.getErrorMessage)(err);
        return res.status(code).send(message);
    }
}));
userRouter.post("/create", passport_utils_1.ensureAdminAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).send("Unauthorized");
        const _a = request_body_1.CreateUserBodySchema.parse(req.body), { email } = _a, rest = __rest(_a, ["email"]);
        const newUser = yield mongoose_1.User.create(Object.assign(Object.assign({ email }, rest), { admin_id: req.user._id }));
        const verification = yield mongoose_1.Verification.create({
            user_id: newUser._id,
            type: "registration",
            expiryAt: new Date(+Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        });
        emailClient.sendMail((0, register_1.default)({ registrationCode: verification._id.toString() }), { to: email, from: EMAIL_FROM, subject: "Register on Student Portal" });
        return res.json(newUser);
    }
    catch (err) {
        console.log(err);
        const [code, message] = (0, response_utils_1.getErrorMessage)(err);
        return res.status(code).send(message);
    }
}));
userRouter.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _b = request_body_1.RegisterUserBodySchema.parse(req.body), { registration_id, password } = _b, formData = __rest(_b, ["registration_id", "password"]);
        const verification = yield mongoose_1.Verification.findOne({
            _id: registration_id,
            active: true,
            expiryAt: { $gte: new Date() },
            type: "registration",
        }).sort({ createdAt: -1 });
        if (!verification)
            return res.status(400).send("Verification code invalid");
        verification.active = false;
        yield verification.save();
        const updatedUser = yield mongoose_1.User.findByIdAndUpdate(verification.user_id, Object.assign(Object.assign({}, formData), { password: yield (0, crypto_utils_1.hashPassword)(password), is_active: true }), {
            returnDocument: "after",
            select: {
                password: false,
            },
        }).lean();
        return res.json(updatedUser);
    }
    catch (err) {
        console.log(err);
        const [code, message] = (0, response_utils_1.getErrorMessage)(err);
        return res.status(code).send(message);
    }
}));
userRouter.put("/profile", passport_utils_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).send("Unauthorized");
        const formData = request_body_1.UpdateUserProfileBodySchema.parse(req.body);
        const updatedUser = yield mongoose_1.User.findByIdAndUpdate(req.user._id, formData, {
            returnDocument: "after",
            select: {
                password: false,
            },
        }).lean();
        return res.json(updatedUser);
    }
    catch (err) {
        console.log(err);
        const [code, message] = (0, response_utils_1.getErrorMessage)(err);
        return res.status(code).send(message);
    }
}));
userRouter.put("/change-profile-image", passport_utils_1.ensureAuthenticated, upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).send("Unauthorized");
        if (req.file) {
            //console.log(req.file, req.file.buffer);
            const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
            const uploadId = yield fileClient.upload(blob);
            yield mongoose_1.File.create({
                _id: uploadId,
                name: req.file.originalname,
                mimetype: req.file.mimetype,
            });
            const user = yield mongoose_1.User.findByIdAndUpdate(req.user._id, {
                profile_image: uploadId,
            }, { returnDocument: "after" });
            return res.json(user);
        }
        else {
            return res.status(400).send("Image not provided");
        }
    }
    catch (err) {
        console.log(err);
        const [code, message] = (0, response_utils_1.getErrorMessage)(err);
        return res.status(code).send(message);
    }
}));
userRouter.put("/change-status", passport_utils_1.ensureAdminAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).send("Unauthorized");
        const formData = request_body_1.ChangeUserStatusBodySchema.parse(req.body);
        const updatedUser = yield mongoose_1.User.findOneAndUpdate({ _id: formData.user_id, admin_id: req.user._id }, { is_active: formData.is_active }, {
            returnDocument: "after",
            select: {
                password: false,
            },
        }).lean();
        return res.json(updatedUser);
    }
    catch (err) {
        console.log(err);
        const [code, message] = (0, response_utils_1.getErrorMessage)(err);
        return res.status(code).send(message);
    }
}));
userRouter.post("/change-password", passport_utils_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).send("Unauthorized");
        const formData = request_body_1.ChangePasswordBodySchema.parse(req.body);
        const currentUser = yield mongoose_1.User.findById(req.user._id);
        if (currentUser) {
            if (yield currentUser.comparePassword(formData.oldPassword)) {
                currentUser.password = formData.newPassword;
                yield currentUser.save();
                return res.status(204).send();
            }
            else {
                return res.status(401).send("Invalid password");
            }
        }
        else {
            return res.status(401).send("User not found");
        }
    }
    catch (err) {
        console.log(err);
        const [code, message] = (0, response_utils_1.getErrorMessage)(err);
        return res.status(code).send(message);
    }
}));
userRouter.put("/reset-password", passport_utils_1.ensureAdminAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).send("Unauthorized");
        const { password, confirm, user_id } = request_body_1.ResetPasswordBodySchema.parse(req.body);
        if (password !== confirm)
            return res.status(400).send("Passwords do not match");
        const user = yield mongoose_1.User.findById(user_id);
        if (user) {
            user.password = password;
            yield user.save();
            return res.status(204).send();
        }
        else {
            return res.status(401).send("User not found");
        }
    }
    catch (err) {
        console.log(err);
        const [code, message] = (0, response_utils_1.getErrorMessage)(err);
        return res.status(code).send(message);
    }
}));
userRouter.post("/send-verification-code", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = request_body_1.SendVerificationCodeBodySchema.parse(req.body);
        const user = yield mongoose_1.User.findOne({ email, is_active: true }).lean();
        if (user) {
            const verification = yield mongoose_1.Verification.create({
                user_id: user._id,
                type: "forgot-password",
            });
            emailClient.sendMail((0, verification_1.default)({ verificationCode: verification._id.toString() }), {
                to: email,
                from: EMAIL_FROM,
                subject: "Student Portal Verification Code",
            });
            return res.status(204).send();
        }
        else {
            return res.status(400).send("User not found");
        }
    }
    catch (err) {
        console.log(err);
        const [code, message] = (0, response_utils_1.getErrorMessage)(err);
        return res.status(code).send(message);
    }
}));
userRouter.post("/forgot-password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, verification_code, password } = request_body_1.ForgotPasswordBodySchema.parse(req.body);
        const user = yield mongoose_1.User.findOne({ email, is_active: true });
        if (!user)
            return res.status(400).send("User not found");
        const verification = yield mongoose_1.Verification.findOne({
            _id: verification_code,
            user_id: user._id,
            active: true,
            expiryAt: { $gte: new Date() },
            type: "forgot-password",
        }).sort({ createdAt: -1 });
        //console.log(!verification, verification?.user_id.equals(user._id));
        //console.log(verification?.user_id, user._id);
        if (!verification)
            return res.status(400).send("Verification code invalid");
        verification.active = false;
        user.password = password;
        yield verification.save();
        yield user.save();
        return res.status(204).send();
    }
    catch (err) {
        console.log(err);
        const [code, message] = (0, response_utils_1.getErrorMessage)(err);
        return res.status(code).send(message);
    }
}));
exports.default = userRouter;
