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
const render_1 = require("@react-email/render");
const nodemailer_1 = __importDefault(require("nodemailer"));
const Singleton_1 = __importDefault(require("../lib/classes/Singleton"));
class EmailClient extends Singleton_1.default {
    constructor() {
        super(...arguments);
        this.transporter = null;
    }
    configure(transport) {
        this.transporter = nodemailer_1.default.createTransport(transport);
    }
    sendMail(email, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const emailHtml = (0, render_1.render)(email);
            yield ((_a = this.transporter) === null || _a === void 0 ? void 0 : _a.sendMail(Object.assign({ html: emailHtml }, options)));
        });
    }
}
EmailClient.instance = null;
exports.default = EmailClient;
