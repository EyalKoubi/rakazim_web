import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteAllCategories,
} from "../controllers/classCategoryController";

const router = express.Router();

// /api/categories
router.post("/all", getAllCategories); // GET all
router.get("/:id", getCategoryById); // GET by ID
router.post("/", createCategory); // POST create
router.put("/:id", updateCategory); // PUT update
router.delete("/:id", deleteCategory); // DELETE
router.post("/delete-all", deleteAllCategories);

export default router;
