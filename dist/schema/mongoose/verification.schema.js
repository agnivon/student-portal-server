"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const VerificationSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    active: {
        type: Boolean,
        default: true,
    },
    type: {
        type: String,
        default: null,
    },
    expiryAt: {
        type: Date,
        default: function () {
            return new Date(+new Date() + 15 * 60 * 1000); // 15 minutes from now
        },
    },
}, { timestamps: { currentTime: () => Date.now() } });
exports.default = VerificationSchema;
