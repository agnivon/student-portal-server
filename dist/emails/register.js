"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationEmail = void 0;
const components_1 = require("@react-email/components");
const React = __importStar(require("react"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const baseUrl = process.env.BASE_URL;
const clientHost = process.env.CLIENT_HOST;
const RegistrationEmail = ({ registrationCode }) => (React.createElement(components_1.Html, null,
    React.createElement(components_1.Head, null),
    React.createElement(components_1.Preview, null, "Your registration code for Student Portal"),
    React.createElement(components_1.Body, { style: main },
        React.createElement(components_1.Container, { style: container },
            React.createElement(components_1.Img, { src: `${baseUrl}/public/images/logo.svg`, width: "42", height: "42", alt: "Student Portal", style: logo }),
            React.createElement(components_1.Heading, { style: heading }, "Your registration code for Student Portal"),
            React.createElement(components_1.Section, { style: buttonContainer },
                React.createElement(components_1.Button, { style: button, href: `${clientHost}/register` }, "Register on Student Portal")),
            React.createElement(components_1.Text, { style: paragraph }, "Use this registration code to register as a student on Student Portal."),
            React.createElement("code", { style: code }, registrationCode),
            React.createElement(components_1.Hr, { style: hr }),
            React.createElement(components_1.Link, { href: `${clientHost}/login`, style: reportLink }, "Student Portal")))));
exports.RegistrationEmail = RegistrationEmail;
exports.RegistrationEmail.PreviewProps = {
    registrationCode: "tt226-5398x",
};
exports.default = exports.RegistrationEmail;
const logo = {
    borderRadius: 21,
    width: 42,
    height: 42,
};
const main = {
    backgroundColor: "#ffffff",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};
const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
    maxWidth: "560px",
};
const heading = {
    fontSize: "24px",
    letterSpacing: "-0.5px",
    lineHeight: "1.3",
    fontWeight: "400",
    color: "#484848",
    padding: "17px 0 0",
};
const paragraph = {
    margin: "0 0 15px",
    fontSize: "15px",
    lineHeight: "1.4",
    color: "#3c4149",
};
const buttonContainer = {
    padding: "27px 0 27px",
};
const button = {
    backgroundColor: "#5e6ad2",
    borderRadius: "3px",
    fontWeight: "600",
    color: "#fff",
    fontSize: "15px",
    textDecoration: "none",
    textAlign: "center",
    display: "block",
    padding: "11px 23px",
};
const reportLink = {
    fontSize: "14px",
    color: "#b4becc",
};
const hr = {
    borderColor: "#dfe1e4",
    margin: "42px 0 26px",
};
const code = {
    fontFamily: "monospace",
    fontWeight: "700",
    padding: "1px 4px",
    backgroundColor: "#dfe1e4",
    letterSpacing: "-0.3px",
    fontSize: "21px",
    borderRadius: "4px",
    color: "#3c4149",
};
