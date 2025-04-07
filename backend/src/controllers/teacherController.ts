import { Request, Response } from "express";
import Teacher from "../models/teacher";

// GET all teachers
export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    const coordinatorId = user._id;

    const teachers = await Teacher.find({ coordinator: coordinatorId });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// GET teacher by ID
export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      res.status(404).json({ message: "Teacher not found" });
    } else {
      res.json(teacher);
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// POST create teacher
export const createTeacher = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      idNumber,
      professionalHours,
      dutyHours,
      teachingLevel,
      coordinatorId,
    } = req.body;

    if (!coordinatorId)
      res.status(400).json({ message: "Missing coordinatorId" });
    else {
      if (!["middle", "high", "all"].includes(teachingLevel))
        res.status(400).json({ message: "Invalid teachingLevel" });
      else {
        const existing = await Teacher.findOne({
          idNumber,
          coordinator: coordinatorId,
        });

        if (existing)
          res.status(400).json({ message: "Teacher already exists" });
        else {
          const teacher = new Teacher({
            fullName,
            idNumber,
            professionalHours,
            dutyHours,
            teachingLevel,
            coordinator: coordinatorId,
          });

          await teacher.save();
          res.status(201).json(teacher);
        }
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// PUT update teacher
export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const { teachingLevel } = req.body;
    if (teachingLevel && !["middle", "high", "all"].includes(teachingLevel)) {
      res.status(400).json({ message: "Invalid teachingLevel" });
    } else {
      const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      if (!teacher) {
        res.status(404).json({ message: "Teacher not found" });
      } else {
        res.json(teacher);
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// DELETE teacher
export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      res.status(404).json({ message: "Teacher not found" });
    } else {
      res.json({ message: "Teacher deleted successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// DELETE all teachers by coordinator
export const deleteAllTeachers = async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    const coordinatorId = user._id;

    await Teacher.deleteMany({ coordinator: coordinatorId });

    res.json({ message: "כל המורים נמחקו בהצלחה" });
  } catch (err) {
    res.status(500).json({ message: "שגיאה במחיקת כל המורים", error: err });
  }
};
