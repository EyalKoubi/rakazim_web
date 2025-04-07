"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teacherController_1 = require("../controllers/teacherController");
const router = express_1.default.Router();
router.post("/all", teacherController_1.getAllTeachers);
router.get("/:id", teacherController_1.getTeacherById);
router.post("/", teacherController_1.createTeacher);
router.put("/:id", teacherController_1.updateTeacher);
router.delete("/:id", teacherController_1.deleteTeacher);
router.post("/delete-all", teacherController_1.deleteAllTeachers);
exports.default = router;
