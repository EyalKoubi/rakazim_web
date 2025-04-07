"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const savedAssignmentSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    assignments: [
        {
            teacherName: { type: String, required: true },
            className: { type: String, required: true },
            hours: { type: Number, required: true },
        },
    ],
    createdAt: { type: Date, default: Date.now },
});
exports.default = mongoose_1.default.model("SavedAssignment", savedAssignmentSchema);
