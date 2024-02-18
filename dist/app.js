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
const assert_1 = __importDefault(require("assert"));
const express_1 = __importDefault(require("express"));
const email_1 = __importDefault(require("./clients/email"));
const file_1 = __importDefault(require("./clients/file"));
const mongoose_1 = __importDefault(require("./clients/mongoose"));
const middleware_1 = __importDefault(require("./middleware"));
const routes_1 = __importDefault(require("./routes"));
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const { FILE_API_ENDPOINT, FILE_API_AUTH_ENDPOINT, FILE_API_USERNAME, FILE_API_PASSWORD, } = process.env;
const { EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD, EMAIL_SERVER_HOST, EMAIL_SERVER_PORT, } = process.env;
(0, assert_1.default)(Boolean(FILE_API_ENDPOINT), new Error("FILE_API_ENDPOINT not defined"));
(0, assert_1.default)(Boolean(FILE_API_AUTH_ENDPOINT), new Error("FILE_API_AUTH_ENDPOINT not defined"));
(0, assert_1.default)(Boolean(FILE_API_USERNAME), new Error("FILE_API_USERNAME not defined"));
(0, assert_1.default)(Boolean(FILE_API_PASSWORD), new Error("FILE_API_PASSWORD not defined"));
const fileClient = file_1.default.getInstance();
fileClient.configure(FILE_API_ENDPOINT, FILE_API_AUTH_ENDPOINT);
const emailClient = email_1.default.getInstance();
emailClient.configure({
    host: EMAIL_SERVER_HOST,
    port: Number(EMAIL_SERVER_PORT),
    secure: false,
    auth: {
        user: EMAIL_SERVER_USER,
        pass: EMAIL_SERVER_PASSWORD,
    },
});
(0, mongoose_1.default)((_mongoose) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fileClient.authenticate(FILE_API_USERNAME, FILE_API_PASSWORD);
        (0, middleware_1.default)(app);
        (0, routes_1.default)(app);
        app.get("/test", (_req, res) => {
            return res.status(200).send("OK");
        });
        app.listen(port, () => {
            console.log(`Student Portal Server listening on port ${port}`);
        });
    }
    catch (err) {
        console.log(err);
    }
}));
