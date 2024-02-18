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
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const Singleton_1 = __importDefault(require("../lib/classes/Singleton"));
dotenv_1.default.config();
// const FILE_API_ENDPOINT = process.env.FILE_API_ENDPOINT;
// const FILE_API_AUTH_ENDPOINT = process.env.FILE_API_AUTH_ENDPOINT;
// assert(Boolean(FILE_API_ENDPOINT), new Error("FILE_API_ENDPOINT not defined"));
// assert(
//   Boolean(FILE_API_AUTH_ENDPOINT),
//   new Error("FILE_API_AUTH_ENDPOINT not defined")
// );
class FileClient extends Singleton_1.default {
    constructor() {
        super(...arguments);
        this.authToken = null;
        this.FILE_API_ENDPOINT = "";
        this.FILE_API_AUTH_ENDPOINT = "";
    }
    configure(FILE_API_ENDPOINT, FILE_API_AUTH_ENDPOINT) {
        this.FILE_API_ENDPOINT = FILE_API_ENDPOINT;
        this.FILE_API_AUTH_ENDPOINT = FILE_API_AUTH_ENDPOINT;
    }
    authenticate(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = yield axios_1.default
                .post(this.FILE_API_AUTH_ENDPOINT, {
                email: username,
                password,
            })
                .then((res) => res.data);
            this.authToken = token;
            return this.authToken;
        });
    }
    upload(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = new FormData();
            formData.set("picture", file);
            const { uploadId } = yield axios_1.default
                .post(`${this.FILE_API_ENDPOINT}/uploadfile`, formData, {
                headers: {
                    Authorization: `Bearer ${this.authToken}`,
                },
            })
                .then((res) => res.data);
            return uploadId;
        });
    }
    getFile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield axios_1.default
                .get(`${this.FILE_API_ENDPOINT}/${id}`, {
                responseType: "arraybuffer",
                headers: {
                    Authorization: `Bearer ${this.authToken}`,
                    //"Content-Type": "multipart/form-data",
                },
            })
                .then((res) => res.data);
            return file;
        });
    }
}
FileClient.instance = null;
exports.default = FileClient;
