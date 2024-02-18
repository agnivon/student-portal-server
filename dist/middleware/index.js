"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("./cors"));
const passport_1 = __importDefault(require("./passport"));
const session_1 = __importDefault(require("./session"));
const morgan_1 = __importDefault(require("morgan"));
const env_utils_1 = require("../utils/env.utils");
function middleware(app) {
    (0, cors_1.default)(app);
    app.use("/public", express_1.default.static(process.cwd() + "/public"));
    app.use(express_1.default.json()); // for parsing application/json
    app.use(express_1.default.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    app.use((0, morgan_1.default)((0, env_utils_1.isDev)() ? "dev" : "short"));
    (0, session_1.default)(app);
    (0, passport_1.default)(app);
}
exports.default = middleware;
