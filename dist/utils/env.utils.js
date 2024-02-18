"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDev = exports.isProduction = void 0;
function isProduction() {
    return process.env.NODE_ENV === "production";
}
exports.isProduction = isProduction;
function isDev() {
    return process.env.NODE_ENV === "development";
}
exports.isDev = isDev;
