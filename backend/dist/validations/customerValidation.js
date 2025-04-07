"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerQuerySchema = void 0;
// Joi schema for validating login request body
const joi_1 = __importDefault(require("joi"));
// Defines the structure and rules for login payload
exports.customerQuerySchema = joi_1.default.object({
    name: joi_1.default.string().optional(),
});
