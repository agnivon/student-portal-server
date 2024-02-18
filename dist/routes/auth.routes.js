"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const object_utils_1 = require("../utils/object.utils");
const authRouter = express_1.default.Router();
const authenticateCallback = (req, res, next) => (err, user, info) => {
    try {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send(info.message);
        }
        req.login(user, (err) => {
            if (err)
                return next(err);
            return res.json((0, object_utils_1.removeFields)(user, ["password"]));
        });
    }
    catch (err) {
        return next(err);
    }
};
authRouter.post("/login", 
// passport.authenticate("local"),
// (req, res) => {
//   if (!req.user) return res.status(401).send("Unauthorized");
//   return res.status(200).json(removeFields(req.user, ["password"]));
// }
(req, res, next) => passport_1.default.authenticate("local", authenticateCallback(req, res, next))(req, res, next));
authRouter.post("/logout", (req, res) => {
    req.logout((err) => {
        if (err)
            return res.status(500).send("Internal Server Error");
        else
            return res.status(204).send();
    });
});
exports.default = authRouter;
