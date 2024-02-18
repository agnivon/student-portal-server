"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
function corsMiddleware(app) {
    app.use((0, cors_1.default)({
        origin: process.env.CLIENT_HOST,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: [
            "Origin",
            "X-Requested-With",
            "Content-Type",
            "Accept",
            "Authorization",
            "X-HTTP-Method-Override",
            "Set-Cookie",
            "Cookie",
        ],
    }));
    app.set("trust proxy", 1);
}
exports.default = corsMiddleware;
