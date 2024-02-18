"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    title: { type: String, required: true },
    content: { type: String, required: true },
    attachments: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "File" }],
        default: [],
    },
}, { timestamps: { currentTime: () => Date.now() } });
exports.default = PostSchema;
