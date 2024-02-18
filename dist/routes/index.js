"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_routes_1 = __importDefault(require("./user.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const file_routes_1 = __importDefault(require("./file.routes"));
const post_route_1 = __importDefault(require("./post.route"));
const leave_routes_1 = __importDefault(require("./leave.routes"));
function routes(app) {
    app.use("/auth", auth_routes_1.default);
    app.use("/user", user_routes_1.default);
    app.use("/file", file_routes_1.default);
    app.use("/post", post_route_1.default);
    app.use("/leave", leave_routes_1.default);
}
exports.default = routes;
