import express from "express";
import {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  deleteAllClasses,
} from "../controllers/schoolClassController";

const router = express.Router();

// /api/classes
router.post("/all", getAllClasses); // GET all
router.get("/:id", getClassById); // GET by ID
router.post("/", createClass); // POST create
router.put("/:id", updateClass); // PUT update
router.delete("/:id", deleteClass); // DELETE
router.post("/delete-all", deleteAllClasses);

export default router;
