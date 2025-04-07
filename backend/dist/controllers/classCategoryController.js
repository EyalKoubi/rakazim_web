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
exports.deleteAllCategories = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const classCategory_1 = __importDefault(require("../models/classCategory"));
const schoolClass_1 = __importDefault(require("../models/schoolClass"));
// GET all categories
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req.body;
        const coordinatorId = user._id;
        const categories = yield classCategory_1.default.find({ coordinator: coordinatorId });
        res.json(categories);
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.getAllCategories = getAllCategories;
// GET category by ID
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield classCategory_1.default.findById(req.params.id);
        if (!category)
            res.status(404).json({ message: "Category not found" });
        else
            res.json(category);
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.getCategoryById = getCategoryById;
// POST create category
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, teacherCount, user } = req.body;
        const coordinatorId = user._id;
        if (![1, 2].includes(teacherCount))
            res.status(400).json({ message: "teacherCount must be 1 or 2" });
        else {
            const category = new classCategory_1.default({
                name,
                teacherCount,
                coordinator: coordinatorId,
            });
            yield category.save();
            res.status(201).json(category);
        }
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.createCategory = createCategory;
// PUT update category
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield classCategory_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category)
            res.status(404).json({ message: "Category not found" });
        else
            res.json(category);
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.updateCategory = updateCategory;
// DELETE category
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield classCategory_1.default.findById(req.params.id);
        if (!category)
            res.status(404).json({ message: "Category not found" });
        else {
            yield schoolClass_1.default.deleteMany({ category: category._id });
            yield category.deleteOne();
            res.json({
                message: "Category and related classes deleted successfully",
            });
        }
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.deleteCategory = deleteCategory;
const deleteAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req.body;
        const coordinatorId = user._id;
        const categories = yield classCategory_1.default.find({ coordinator: coordinatorId });
        const categoryIds = categories.map((cat) => cat._id);
        yield schoolClass_1.default.deleteMany({ category: { $in: categoryIds } });
        yield classCategory_1.default.deleteMany({ coordinator: coordinatorId });
        res.json({ message: "All categories and related classes deleted" });
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.deleteAllCategories = deleteAllCategories;
