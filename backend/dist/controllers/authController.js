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
exports.getMe = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
// POST /api/auth/register
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, username, password } = req.body;
        const existing = yield user_1.default.findOne({ $or: [{ email }, { username }] });
        if (existing) {
            res.status(400).json({ message: "Email or username already exists" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield user_1.default.create({
            fullName,
            email,
            username,
            password: hashedPassword,
        });
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.register = register;
// POST /api/auth/login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield user_1.default.findOne({ username });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({
            token,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                username: user.username,
            },
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.login = login;
// GET /api/auth/me
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const user = yield user_1.default.findById(userId).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.getMe = getMe;
