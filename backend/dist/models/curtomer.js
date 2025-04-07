"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Mongoose model for Customer entity
// Defines the schema for customer documents in MongoDB, including validations
const mongoose_1 = __importDefault(require("mongoose"));
const customerSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true, // Must be provided
        trim: true, // Removes leading/trailing whitespace
        minlength: 2,
        maxlength: 50,
    },
    id: {
        type: Number,
        required: true, // Must be provided
        unique: true, // Ensures no duplicate IDs
        min: 100000000, // 9-digit minimum
        max: 999999999, // 9-digit maximum
    },
    phone: {
        type: String,
        required: true, // Must be provided
        match: /^\+972-5\d{2}-\d{3}-\d{4}$/, // Validates Israeli mobile phone format
    },
});
// Exporting the Customer model to interact with the 'customers' collection
exports.default = mongoose_1.default.model("Customer", customerSchema);
