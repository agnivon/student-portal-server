"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const mongoose_1 = __importDefault(require("mongoose"));
function connect(callback) {
    const MONGODB_URI = process.env.MONGODB_URI;
    (0, assert_1.default)(MONGODB_URI, new Error("MONGODB_URI not defined"));
    return mongoose_1.default.connect(MONGODB_URI).then(callback);
}
exports.default = connect;
