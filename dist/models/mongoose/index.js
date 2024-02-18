"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Verification = exports.Leave = exports.Post = exports.File = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const file_schema_1 = __importDefault(require("../../schema/mongoose/file.schema"));
const leave_schema_1 = __importDefault(require("../../schema/mongoose/leave.schema"));
const post_schema_1 = __importDefault(require("../../schema/mongoose/post.schema"));
const user_schema_1 = __importDefault(require("../../schema/mongoose/user.schema"));
const verification_schema_1 = __importDefault(require("../../schema/mongoose/verification.schema"));
exports.User = mongoose_1.default.model("User", user_schema_1.default);
exports.File = mongoose_1.default.model("File", file_schema_1.default);
exports.Post = mongoose_1.default.model("Post", post_schema_1.default);
exports.Leave = mongoose_1.default.model("Leave", leave_schema_1.default);
exports.Verification = mongoose_1.default.model("Verification", verification_schema_1.default);
