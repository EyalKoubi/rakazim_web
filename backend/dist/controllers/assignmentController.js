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
exports.deleteSavedAssignmentMap = exports.getAllSavedAssignmentMaps = exports.saveAssignmentMapToMongo = exports.deleteAssignmentsByCoordinator = exports.getSavedAssignments = exports.saveAssignments = exports.getAssignmentOptions = void 0;
const teacher_1 = __importDefault(require("../models/teacher"));
const schoolClass_1 = __importDefault(require("../models/schoolClass"));
const assigment_1 = __importDefault(require("../models/assigment"));
const savedAssignment_1 = __importDefault(require("../models/savedAssignment"));
const getAssignmentOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body.user;
        const coordinatorId = user._id;
        const teachersRaw = yield teacher_1.default.find({
            coordinator: coordinatorId,
        }).lean();
        const classesRaw = yield schoolClass_1.default.find({ coordinator: coordinatorId })
            .populate("category")
            .lean();
        const gradeToLevel = (grade) => ["ז׳", "ח׳", "ט׳"].includes(grade) ? "middle" : "high";
        const generateVariant = (seed = 0) => {
            const teachers = teachersRaw.map((t) => ({
                _id: t._id.toString(),
                fullName: t.fullName,
                idNumber: t.idNumber,
                remainingHours: t.professionalHours - t.dutyHours,
                teachingLevel: t.teachingLevel,
                usedCategories: new Set(),
            }));
            const classes = [...classesRaw].sort(() => Math.random() - seed);
            const assignments = [];
            const gradeToLevel = (grade) => ["ז׳", "ח׳", "ט׳"].includes(grade) ? "middle" : "high";
            const alreadyAssignedClassIds = new Set();
            // ניסיון מוקדם לתת ל־"all" גיוון
            for (const teacher of teachers.filter((t) => t.teachingLevel === "all")) {
                const eligibleMiddle = classes.find((c) => !alreadyAssignedClassIds.has(c._id.toString()) &&
                    ["ז׳", "ח׳", "ט׳"].includes(c.grade) &&
                    teacher.remainingHours >= c.totalHours + c.bonusHours);
                const eligibleHigh = classes.find((c) => !alreadyAssignedClassIds.has(c._id.toString()) &&
                    ["י׳", "י״א", "י״ב"].includes(c.grade) &&
                    teacher.remainingHours >= c.totalHours + c.bonusHours);
                for (const match of [eligibleMiddle, eligibleHigh]) {
                    if (!match)
                        continue;
                    const hours = match.totalHours + match.bonusHours;
                    teacher.remainingHours -= hours;
                    teacher.usedCategories.add(match.category._id.toString());
                    alreadyAssignedClassIds.add(match._id.toString());
                    assignments.push({
                        teacher: {
                            _id: teacher._id,
                            fullName: teacher.fullName,
                            idNumber: teacher.idNumber,
                        },
                        class: {
                            _id: match._id.toString(),
                            name: match.name,
                            grade: match.grade,
                        },
                        hours,
                    });
                }
            }
            // המשך שיבוץ רגיל
            for (const schoolClass of classes) {
                const categoryId = schoolClass.category._id.toString();
                const requiredTeachers = schoolClass.category.teacherCount;
                const hoursForClass = schoolClass.totalHours + schoolClass.bonusHours;
                const levelNeeded = gradeToLevel(schoolClass.grade);
                const alreadyAssigned = assignments
                    .filter((a) => a.class._id === schoolClass._id.toString())
                    .map((a) => a.teacher._id);
                const suitableTeachers = teachers
                    .filter((t) => {
                    const canTeach = t.teachingLevel === "all" || t.teachingLevel === levelNeeded;
                    return (canTeach &&
                        t.remainingHours >= hoursForClass &&
                        !alreadyAssigned.includes(t._id));
                })
                    .sort((a, b) => a.remainingHours - b.remainingHours);
                for (let i = 0; i < requiredTeachers && i < suitableTeachers.length; i++) {
                    const chosen = suitableTeachers[i];
                    chosen.remainingHours -= hoursForClass;
                    chosen.usedCategories.add(categoryId);
                    assignments.push({
                        teacher: {
                            _id: chosen._id,
                            fullName: chosen.fullName,
                            idNumber: chosen.idNumber,
                        },
                        class: {
                            _id: schoolClass._id.toString(),
                            name: schoolClass.name,
                            grade: schoolClass.grade,
                        },
                        hours: hoursForClass,
                    });
                }
            }
            return assignments;
        };
        const options = [0, 1, 2, 3].map((i) => ({
            optionName: `שיבוץ מגוון ${i + 1}`,
            assignments: generateVariant(i / 10),
        }));
        res.json(options);
    }
    catch (err) {
        console.error("❌ Failed to generate assignment options:", err);
        res.status(500).json({
            message: "שגיאה ביצירת אפשרויות שיבוץ",
            error: err,
        });
    }
});
exports.getAssignmentOptions = getAssignmentOptions;
const saveAssignments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assignments, user } = req.body;
        if (!assignments || !Array.isArray(assignments) || !(user === null || user === void 0 ? void 0 : user._id)) {
            res.status(400).json({ message: "Missing assignments or user" });
        }
        else {
            const docs = assignments.map((a) => ({
                teacher: a.teacher._id,
                class: a.class._id,
                hours: a.hours,
                coordinator: user._id,
            }));
            yield assigment_1.default.insertMany(docs);
            res.status(201).json({ message: "Assignments saved successfully" });
        }
    }
    catch (err) {
        console.error("❌ Failed to save assignments:", err);
        res.status(500).json({ message: "שגיאה בשמירת השיבוצים", error: err });
    }
});
exports.saveAssignments = saveAssignments;
const getSavedAssignments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body.user;
        const coordinatorId = user._id;
        const assignments = yield assigment_1.default.find()
            .populate({
            path: "class",
            match: { coordinator: coordinatorId },
            populate: { path: "category" },
        })
            .populate("teacher");
        const filtered = assignments.filter((a) => a.class !== null);
        const mapped = filtered.map((a) => {
            const teacher = a.teacher;
            const schoolClass = a.class;
            return {
                _id: a._id,
                teacher: {
                    _id: teacher._id,
                    fullName: teacher.fullName,
                    idNumber: teacher.idNumber,
                },
                class: {
                    _id: schoolClass._id,
                    name: schoolClass.name,
                    grade: schoolClass.grade,
                },
                hours: a.hours,
            };
        });
        res.json(mapped);
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "שגיאה בטעינת שיבוצים שמורים", error: err });
    }
});
exports.getSavedAssignments = getSavedAssignments;
const deleteAssignmentsByCoordinator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req.body;
        if (!(user === null || user === void 0 ? void 0 : user._id))
            res.status(400).json({ message: "חסר מזהה משתמש" });
        else {
            yield assigment_1.default.deleteMany({ coordinator: user._id });
            res.json({ message: "השיבוצים נמחקו בהצלחה" });
        }
    }
    catch (err) {
        console.error("שגיאה במחיקת השיבוצים", err);
        res.status(500).json({ message: "שגיאה במחיקה", error: err });
    }
});
exports.deleteAssignmentsByCoordinator = deleteAssignmentsByCoordinator;
const saveAssignmentMapToMongo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, assignments } = req.body;
        if (!title || !(assignments === null || assignments === void 0 ? void 0 : assignments.length))
            res.status(400).json({ message: "חסרים נתונים לשמירה" });
        else {
            const cleaned = assignments.map((a) => ({
                teacherName: a.teacher.fullName,
                className: a.class.name,
                hours: a.hours,
            }));
            const saved = yield savedAssignment_1.default.create({
                title,
                assignments: cleaned,
            });
            res.status(201).json({ message: "השיבוץ נשמר", map: saved });
        }
    }
    catch (err) {
        console.error("❌ שגיאה בשמירה:", err);
        res.status(500).json({ message: "שגיאה בשמירת המידע", error: err });
    }
});
exports.saveAssignmentMapToMongo = saveAssignmentMapToMongo;
const getAllSavedAssignmentMaps = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const maps = yield savedAssignment_1.default.find().sort({ createdAt: -1 }).lean();
        res.json(maps);
    }
    catch (err) {
        console.error("❌ שגיאה בטעינת שיבוצים שמורים:", err);
        res.status(500).json({ message: "שגיאה בטעינת השיבוצים", error: err });
    }
});
exports.getAllSavedAssignmentMaps = getAllSavedAssignmentMaps;
const deleteSavedAssignmentMap = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id)
            res.status(400).json({ message: "לא התקבל מזהה למחיקה" });
        else {
            yield savedAssignment_1.default.findByIdAndDelete(id);
            res.json({ message: "השיבוץ נמחק בהצלחה" });
        }
    }
    catch (err) {
        console.error("❌ שגיאה במחיקת שיבוץ:", err);
        res.status(500).json({ message: "שגיאה במחיקת השיבוץ", error: err });
    }
});
exports.deleteSavedAssignmentMap = deleteSavedAssignmentMap;
