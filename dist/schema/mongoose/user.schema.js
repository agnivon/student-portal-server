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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const crypto_utils_1 = require("../../utils/crypto.utils");
const UserSchema = new mongoose_1.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        //index: true,
        //unique: true,
        default: null,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        index: true,
    },
    password: {
        type: String,
        default: null,
    },
    phone: {
        type: String,
        default: null,
    },
    is_active: {
        type: Boolean,
        default: false,
    },
    admin_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        default: null,
        ref: "User",
    },
    profile_image: {
        type: mongoose_1.Schema.Types.ObjectId,
        default: null,
        ref: "File",
    }
}, {
    timestamps: { currentTime: () => Date.now() },
    //toJSON: { virtuals: true },
    //toObject: { virtuals: true },
});
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (!user.isModified("password"))
            return next();
        try {
            if (user.password) {
                user.password = yield (0, crypto_utils_1.hashPassword)(user.password);
                next();
            }
        }
        catch (error) {
            return next(error);
        }
    });
});
// Mongoose method to compare passwords during authentication
UserSchema.statics.comparePassword = crypto_utils_1.comparePassword;
UserSchema.methods.comparePassword = function (candidatePassword) {
    return (0, crypto_utils_1.comparePassword)(this.password || "", candidatePassword);
};
UserSchema.methods.isAdmin = function () {
    try {
        return this.admin_id === null;
    }
    catch (error) {
        throw error;
    }
};
exports.default = UserSchema;
