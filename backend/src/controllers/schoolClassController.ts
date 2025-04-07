import { Request, Response } from "express";
import SchoolClass from "../models/schoolClass";
import ClassCategory from "../models/classCategory";

// GET all classes
export const getAllClasses = async (req: Request, res: Response) => {
  try {
    const user = JSON.parse((req.body.user || "{}").toString());
    const coordinatorId = user._id;
    const classes = await SchoolClass.find({
      coordinator: coordinatorId,
    }).populate("category");
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// GET class by ID
export const getClassById = async (req: Request, res: Response) => {
  try {
    const schoolClass = await SchoolClass.findById(req.params.id).populate(
      "category"
    );
    if (!schoolClass) res.status(404).json({ message: "Class not found" });
    else res.json(schoolClass);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// POST create class
export const createClass = async (req: Request, res: Response) => {
  try {
    const user = JSON.parse((req.body.user || "{}").toString());
    const coordinatorId = user._id;

    const { name, grade, category, totalHours, bonusHours } = req.body;

    const validGrades = ["ז׳", "ח׳", "ט׳", "י׳", "י״א", "י״ב"];
    if (!validGrades.includes(grade)) {
      res.status(400).json({ message: "Invalid grade" });
    } else {
      const categoryExists = await ClassCategory.findById(category);
      if (!categoryExists) {
        res.status(400).json({ message: "Category does not exist" });
      } else {
        const schoolClass = new SchoolClass({
          name,
          grade,
          category,
          totalHours,
          bonusHours,
          coordinator: coordinatorId,
        });
        await schoolClass.save();
        res.status(201).json(schoolClass);
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// PUT update class
export const updateClass = async (req: Request, res: Response) => {
  try {
    const { name, grade, category, totalHours, bonusHours, coordinator } =
      req.body;

    const validGrades = ["ז׳", "ח׳", "ט׳", "י׳", "י״א", "י״ב"];
    if (grade && !validGrades.includes(grade)) {
      res.status(400).json({ message: "Invalid grade" });
    } else if (!category || category === "") {
      res.status(400).json({ message: "Category is required" });
    } else {
      const categoryExists = await ClassCategory.findById(category);
      if (!categoryExists) {
        res.status(400).json({ message: "Category not found" });
      } else {
        const updated = await SchoolClass.findByIdAndUpdate(
          req.params.id,
          {
            name,
            grade,
            category,
            totalHours,
            bonusHours,
            coordinator,
          },
          { new: true }
        );

        if (!updated) {
          res.status(404).json({ message: "Class not found" });
        } else {
          res.json(updated);
        }
      }
    }
  } catch (err) {
    console.error("💥 UPDATE ERROR", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// DELETE class
export const deleteClass = async (req: Request, res: Response) => {
  try {
    const deleted = await SchoolClass.findByIdAndDelete(req.params.id);
    if (!deleted) res.status(404).json({ message: "Class not found" });
    else res.json({ message: "Class deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// DELETE all classes by coordinator
export const deleteAllClasses = async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    const coordinatorId = user._id;

    await SchoolClass.deleteMany({ coordinator: coordinatorId });

    res.json({ message: "כל הכיתות נמחקו בהצלחה" });
  } catch (err) {
    res.status(500).json({ message: "שגיאה במחיקת כל הכיתות", error: err });
  }
};
