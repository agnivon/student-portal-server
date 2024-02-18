"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = void 0;
const axios_1 = require("axios");
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
function getErrorMessage(err) {
    var _a;
    if (err instanceof zod_1.ZodError) {
        return [400, err.errors.map((e) => e.message).join(",")];
    }
    if (err instanceof axios_1.AxiosError) {
        return [500, (_a = err.response) === null || _a === void 0 ? void 0 : _a.data];
    }
    if (err instanceof mongoose_1.MongooseError) {
        return [500, err.message];
    }
    if (err instanceof Error) {
        return [500, err.message];
    }
    return [500, "Internal Server Error"];
}
exports.getErrorMessage = getErrorMessage;
