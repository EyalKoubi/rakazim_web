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
exports.getCustomers = void 0;
const curtomer_1 = __importDefault(require("../models/curtomer"));
const getCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.query;
        // Build a search query: if 'name' is provided, use case-insensitive partial match
        const query = name
            ? { name: { $regex: new RegExp(name, "i") } }
            : {};
        // Retrieve matching customers from the database
        const customers = yield curtomer_1.default.find(query);
        res.json(customers);
    }
    catch (err) {
        // Handle unexpected errors
        res.status(500).json({ error: "Failed to fetch customers" });
    }
});
exports.getCustomers = getCustomers;
