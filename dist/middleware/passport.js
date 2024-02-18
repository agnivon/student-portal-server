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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const mongoose_1 = require("../models/mongoose");
function passportMiddleware(app) {
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    passport_1.default.use(new passport_local_1.Strategy((username, password, done) => __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield mongoose_1.User.findOne({ email: username }).lean();
            console.log(`User ${username} attempted to log in.`);
            if (!user)
                return done(null, false, { message: "Invalid email" });
            if (!(yield mongoose_1.User.comparePassword(user.password || "", password))) {
                return done(null, false, {
                    message: "Invalid password",
                });
            }
            if (!user.is_active)
                return done(null, false, { message: "Inactive user" });
            return done(null, user);
        }
        catch (err) {
            return done(err);
        }
    })));
    passport_1.default.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport_1.default.deserializeUser((id, done) => __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield mongoose_1.User.findById(id).select({ password: 0 }).lean();
            done(null, user);
        }
        catch (err) {
            done(err);
        }
    }));
}
exports.default = passportMiddleware;
