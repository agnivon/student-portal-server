"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_session_1 = __importDefault(require("express-session"));
const assert_1 = __importDefault(require("assert"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const mongoose_1 = __importDefault(require("mongoose"));
const env_utils_1 = require("../utils/env.utils");
function sessionMiddleware(app) {
    const secret = process.env.SESSION_SECRET;
    (0, assert_1.default)(secret, new Error("SESSION_SECRET not defined"));
    const options = {
        secret: process.env.SESSION_SECRET,
        resave: true,
        key: "express.sid",
        unset: "destroy",
        store: connect_mongo_1.default.create({
            client: mongoose_1.default.connection.getClient(),
            collectionName: "sessions",
            stringify: false,
            ttl: 14 * 24 * 60 * 60, // = 14 days
        }),
        saveUninitialized: true,
        cookie: {
            secure: (0, env_utils_1.isProduction)(),
            sameSite: (0, env_utils_1.isProduction)() ? "none" : undefined,
            path: "/",
            httpOnly: true,
            partitioned: true,
        },
    };
    app.use((0, express_session_1.default)(options));
}
exports.default = sessionMiddleware;
