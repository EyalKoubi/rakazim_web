import { Request, Response } from "express";
import ClassCategory from "../models/classCategory";
import SchoolClass from "../models/schoolClass";

// GET all categories
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    const coordinatorId = user._id;
    const categories = await ClassCategory.find({ coordinator: coordinatorId });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// GET category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await ClassCategory.findById(req.params.id);
    if (!category) res.status(404).json({ message: "Category not found" });
    else res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// POST create category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, teacherCount, user } = req.body;
    const coordinatorId = user._id;

    if (![1, 2].includes(teacherCount))
      res.status(400).json({ message: "teacherCount must be 1 or 2" });
    else {
      const category = new ClassCategory({
        name,
        teacherCount,
        coordinator: coordinatorId,
      });
      await category.save();
      res.status(201).json(category);
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// PUT update category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await ClassCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!category) res.status(404).json({ message: "Category not found" });
    else res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// DELETE category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await ClassCategory.findById(req.params.id);
    if (!category) res.status(404).json({ message: "Category not found" });
    else {
      await SchoolClass.deleteMany({ category: category._id });
      await category.deleteOne();

      res.json({
        message: "Category and related classes deleted successfully",
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const deleteAllCategories = async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    const coordinatorId = user._id;

    const categories = await ClassCategory.find({ coordinator: coordinatorId });
    const categoryIds = categories.map((cat) => cat._id);

    await SchoolClass.deleteMany({ category: { $in: categoryIds } });
    await ClassCategory.deleteMany({ coordinator: coordinatorId });

    res.json({ message: "All categories and related classes deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
