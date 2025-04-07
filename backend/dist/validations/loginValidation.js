"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
// Joi schema for validating login request body
const joi_1 = __importDefault(require("joi"));
// Defines the structure and rules for login payload
exports.loginSchema = joi_1.default.object({
    username: joi_1.default.string().required().messages({
        "string.empty": "Username is required",
    }),
    password: joi_1.default.string().required().messages({
        "string.empty": "Password is required",
    }),
});
