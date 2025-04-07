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
exports.deleteAllTeachers = exports.deleteTeacher = exports.updateTeacher = exports.createTeacher = exports.getTeacherById = exports.getAllTeachers = void 0;
const teacher_1 = __importDefault(require("../models/teacher"));
// GET all teachers
const getAllTeachers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req.body;
        const coordinatorId = user._id;
        const teachers = yield teacher_1.default.find({ coordinator: coordinatorId });
        res.json(teachers);
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.getAllTeachers = getAllTeachers;
// GET teacher by ID
const getTeacherById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teacher = yield teacher_1.default.findById(req.params.id);
        if (!teacher) {
            res.status(404).json({ message: "Teacher not found" });
        }
        else {
            res.json(teacher);
        }
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.getTeacherById = getTeacherById;
// POST create teacher
const createTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, idNumber, professionalHours, dutyHours, teachingLevel, coordinatorId, } = req.body;
        if (!coordinatorId)
            res.status(400).json({ message: "Missing coordinatorId" });
        else {
            if (!["middle", "high", "all"].includes(teachingLevel))
                res.status(400).json({ message: "Invalid teachingLevel" });
            else {
                const existing = yield teacher_1.default.findOne({
                    idNumber,
                    coordinator: coordinatorId,
                });
                if (existing)
                    res.status(400).json({ message: "Teacher already exists" });
                else {
                    const teacher = new teacher_1.default({
                        fullName,
                        idNumber,
                        professionalHours,
                        dutyHours,
                        teachingLevel,
                        coordinator: coordinatorId,
                    });
                    yield teacher.save();
                    res.status(201).json(teacher);
                }
            }
        }
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.createTeacher = createTeacher;
// PUT update teacher
const updateTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teachingLevel } = req.body;
        if (teachingLevel && !["middle", "high", "all"].includes(teachingLevel)) {
            res.status(400).json({ message: "Invalid teachingLevel" });
        }
        else {
            const teacher = yield teacher_1.default.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });
            if (!teacher) {
                res.status(404).json({ message: "Teacher not found" });
            }
            else {
                res.json(teacher);
            }
        }
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.updateTeacher = updateTeacher;
// DELETE teacher
const deleteTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teacher = yield teacher_1.default.findByIdAndDelete(req.params.id);
        if (!teacher) {
            res.status(404).json({ message: "Teacher not found" });
        }
        else {
            res.json({ message: "Teacher deleted successfully" });
        }
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.deleteTeacher = deleteTeacher;
// DELETE all teachers by coordinator
const deleteAllTeachers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req.body;
        const coordinatorId = user._id;
        yield teacher_1.default.deleteMany({ coordinator: coordinatorId });
        res.json({ message: "כל המורים נמחקו בהצלחה" });
    }
    catch (err) {
        res.status(500).json({ message: "שגיאה במחיקת כל המורים", error: err });
    }
});
exports.deleteAllTeachers = deleteAllTeachers;
