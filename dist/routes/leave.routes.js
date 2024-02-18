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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("../models/mongoose");
const request_body_1 = require("../schema/validation/request_body");
const passport_utils_1 = require("../utils/passport.utils");
const response_utils_1 = require("../utils/response.utils");
const leaveRouter = express_1.default.Router();
leaveRouter.get("/my-leaves", passport_utils_1.ensureUserAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).send("Unauthorized");
        const leaves = yield mongoose_1.Leave.find({ student: req.user._id })
            .sort({ createdAt: -1 })
            .lean();
        return res.json(leaves);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
}));
leaveRouter.get("/all-leaves", passport_utils_1.ensureAdminAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).send("Unauthorized");
        const adminStudentIds = yield mongoose_1.User.find({ admin_id: req.user._id })
            .lean()
            .select({ _id: 1 })
            .exec();
        const leaves = yield mongoose_1.Leave.find({ student: { $in: adminStudentIds } })
            .populate("student", { password: 0 })
            .sort({ createdAt: -1 })
            .lean()
            .exec();
        return res.json(leaves);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
}));
leaveRouter.post("/apply", passport_utils_1.ensureUserAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).send("Unauthorized");
        const body = request_body_1.ApplyLeaveBodySchema.parse(req.body);
        const existingLeave = yield mongoose_1.Leave.exists({
            student: req.user._id,
            approved: { $in: [null, true] },
            $or: [
                { from_date: { $gte: body.from_date, $lte: body.to_date } },
                { to_date: { $gte: body.from_date, $lte: body.to_date } },
                {
                    from_date: { $lte: body.from_date },
                    to_date: { $gte: body.to_date },
                },
            ],
        });
        if (existingLeave)
            return res
                .status(400)
                .send("New leave cannot overlap with previous leaves");
        const newLeave = yield mongoose_1.Leave.create(Object.assign({ student: req.user._id }, body));
        return res.json(newLeave);
    }
    catch (err) {
        console.log(err);
        const [code, message] = (0, response_utils_1.getErrorMessage)(err);
        return res.status(code).send(message);
    }
}));
leaveRouter.post("/approval/:id", passport_utils_1.ensureAdminAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).send("Unauthorized");
        const id = req.params.id;
        const { approved } = request_body_1.LeaveApprovalBodySchema.parse(req.body);
        const leave = yield mongoose_1.Leave.findById(id);
        if (leave) {
            if (leave.approved !== null)
                return res.status(400).send("Leave already approved/rejected");
            leave.approved = approved;
            leave.save();
            return res.json(leave);
        }
        else {
            return res.status(400).send(`Leave ${id} not found`);
        }
    }
    catch (err) {
        console.log(err);
        const [code, message] = (0, response_utils_1.getErrorMessage)(err);
        return res.status(code).send(message);
    }
}));
leaveRouter.delete("/:id", passport_utils_1.ensureUserAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).send("Unauthorized");
        const id = req.params.id;
        const leave = yield mongoose_1.Leave.findById(id);
        if (leave) {
            if (leave.approved !== null)
                return res.status(400).send("Leave already approved/rejected");
            yield mongoose_1.Leave.deleteOne({ _id: id });
            return res.json(leave);
        }
        else {
            return res.status(400).send(`Leave ${id} not found`);
        }
    }
    catch (_a) { }
}));
exports.default = leaveRouter;
