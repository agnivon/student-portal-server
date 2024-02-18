"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureUserAuthenticated = exports.ensureAdminAuthenticated = exports.ensureAuthenticated = void 0;
const ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).send("Forbidden");
};
exports.ensureAuthenticated = ensureAuthenticated;
const ensureAdminAuthenticated = function (req, res, next) {
    if (req.isAuthenticated() && req.user.admin_id === null) {
        return next();
    }
    return res.status(401).send("Forbidden");
};
exports.ensureAdminAuthenticated = ensureAdminAuthenticated;
const ensureUserAuthenticated = function (req, res, next) {
    if (req.isAuthenticated() && req.user.admin_id !== null) {
        return next();
    }
    return res.status(401).send("Forbidden");
};
exports.ensureUserAuthenticated = ensureUserAuthenticated;
