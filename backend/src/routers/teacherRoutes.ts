import express from "express";
import {
  deleteTeacher,
  updateTeacher,
  createTeacher,
  getTeacherById,
  getAllTeachers,
  deleteAllTeachers,
} from "../controllers/teacherController";

const router = express.Router();

router.post("/all", getAllTeachers);
router.get("/:id", getTeacherById);
router.post("/", createTeacher);
router.put("/:id", updateTeacher);
router.delete("/:id", deleteTeacher);
router.post("/delete-all", deleteAllTeachers);

export default router;
