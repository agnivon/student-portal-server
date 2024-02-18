"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FileSchema = new mongoose_1.Schema({
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
}, { timestamps: { currentTime: () => Date.now() } });
exports.default = FileSchema;
