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
exports.deleteAllClasses = exports.deleteClass = exports.updateClass = exports.createClass = exports.getClassById = exports.getAllClasses = void 0;
const schoolClass_1 = __importDefault(require("../models/schoolClass"));
const classCategory_1 = __importDefault(require("../models/classCategory"));
// GET all classes
const getAllClasses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse((req.body.user || "{}").toString());
        const coordinatorId = user._id;
        const classes = yield schoolClass_1.default.find({
            coordinator: coordinatorId,
        }).populate("category");
        res.json(classes);
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.getAllClasses = getAllClasses;
// GET class by ID
const getClassById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schoolClass = yield schoolClass_1.default.findById(req.params.id).populate("category");
        if (!schoolClass)
            res.status(404).json({ message: "Class not found" });
        else
            res.json(schoolClass);
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.getClassById = getClassById;
// POST create class
const createClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse((req.body.user || "{}").toString());
        const coordinatorId = user._id;
        const { name, grade, category, totalHours, bonusHours } = req.body;
        const validGrades = ["ז׳", "ח׳", "ט׳", "י׳", "י״א", "י״ב"];
        if (!validGrades.includes(grade)) {
            res.status(400).json({ message: "Invalid grade" });
        }
        else {
            const categoryExists = yield classCategory_1.default.findById(category);
            if (!categoryExists) {
                res.status(400).json({ message: "Category does not exist" });
            }
            else {
                const schoolClass = new schoolClass_1.default({
                    name,
                    grade,
                    category,
                    totalHours,
                    bonusHours,
                    coordinator: coordinatorId,
                });
                yield schoolClass.save();
                res.status(201).json(schoolClass);
            }
        }
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.createClass = createClass;
// PUT update class
const updateClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, grade, category, totalHours, bonusHours, coordinator } = req.body;
        const validGrades = ["ז׳", "ח׳", "ט׳", "י׳", "י״א", "י״ב"];
        if (grade && !validGrades.includes(grade)) {
            res.status(400).json({ message: "Invalid grade" });
        }
        else if (!category || category === "") {
            res.status(400).json({ message: "Category is required" });
        }
        else {
            const categoryExists = yield classCategory_1.default.findById(category);
            if (!categoryExists) {
                res.status(400).json({ message: "Category not found" });
            }
            else {
                const updated = yield schoolClass_1.default.findByIdAndUpdate(req.params.id, {
                    name,
                    grade,
                    category,
                    totalHours,
                    bonusHours,
                    coordinator,
                }, { new: true });
                if (!updated) {
                    res.status(404).json({ message: "Class not found" });
                }
                else {
                    res.json(updated);
                }
            }
        }
    }
    catch (err) {
        console.error("💥 UPDATE ERROR", err);
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.updateClass = updateClass;
// DELETE class
const deleteClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield schoolClass_1.default.findByIdAndDelete(req.params.id);
        if (!deleted)
            res.status(404).json({ message: "Class not found" });
        else
            res.json({ message: "Class deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.deleteClass = deleteClass;
// DELETE all classes by coordinator
const deleteAllClasses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req.body;
        const coordinatorId = user._id;
        yield schoolClass_1.default.deleteMany({ coordinator: coordinatorId });
        res.json({ message: "כל הכיתות נמחקו בהצלחה" });
    }
    catch (err) {
        res.status(500).json({ message: "שגיאה במחיקת כל הכיתות", error: err });
    }
});
exports.deleteAllClasses = deleteAllClasses;
