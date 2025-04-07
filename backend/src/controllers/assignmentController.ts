// src/controllers/assignmentController.ts
import { Request, Response } from "express";
import Teacher from "../models/teacher";
import SchoolClass from "../models/schoolClass";
import { ObjectId } from "mongoose";
import AssignmentModel from "../models/assigment";
import AWS from "aws-sdk";
import SavedAssignment from "../models/savedAssignment";

export type Grade = "ז׳" | "ח׳" | "ט׳" | "י׳" | "י״א" | "י״ב";
export type TeachingLevel = "middle" | "high" | "all";

interface Assignment {
  teacher: {
    _id: string;
    fullName: string;
    idNumber: string;
  };
  class: {
    _id: string;
    name: string;
    grade: Grade;
  };
  hours: number;
}

interface TeacherData {
  _id: string;
  fullName: string;
  idNumber: string;
  remainingHours: number;
  teachingLevel: TeachingLevel;
  usedCategories: Set<string>;
}

interface PopulatedClass {
  _id: ObjectId;
  name: string;
  grade: Grade;
  totalHours: number;
  bonusHours: number;
  category: {
    _id: ObjectId;
    name: string;
    teacherCount: 1 | 2;
  };
}

export const getAssignmentOptions = async (req: Request, res: Response) => {
  try {
    const user = req.body.user;
    const coordinatorId = user._id;

    const teachersRaw = await Teacher.find({
      coordinator: coordinatorId,
    }).lean();
    const classesRaw = await SchoolClass.find({ coordinator: coordinatorId })
      .populate("category")
      .lean<PopulatedClass[]>();

    const gradeToLevel = (grade: Grade): TeachingLevel =>
      ["ז׳", "ח׳", "ט׳"].includes(grade) ? "middle" : "high";

    const generateVariant = (seed = 0): Assignment[] => {
      const teachers: TeacherData[] = teachersRaw.map((t) => ({
        _id: t._id.toString(),
        fullName: t.fullName,
        idNumber: t.idNumber,
        remainingHours: t.professionalHours - t.dutyHours,
        teachingLevel: t.teachingLevel as TeachingLevel,
        usedCategories: new Set(),
      }));

      const classes = [...classesRaw].sort(() => Math.random() - seed);
      const assignments: Assignment[] = [];

      const gradeToLevel = (grade: Grade): TeachingLevel =>
        ["ז׳", "ח׳", "ט׳"].includes(grade) ? "middle" : "high";

      const alreadyAssignedClassIds = new Set<string>();

      // ניסיון מוקדם לתת ל־"all" גיוון
      for (const teacher of teachers.filter((t) => t.teachingLevel === "all")) {
        const eligibleMiddle = classes.find(
          (c) =>
            !alreadyAssignedClassIds.has(c._id.toString()) &&
            ["ז׳", "ח׳", "ט׳"].includes(c.grade) &&
            teacher.remainingHours >= c.totalHours + c.bonusHours
        );

        const eligibleHigh = classes.find(
          (c) =>
            !alreadyAssignedClassIds.has(c._id.toString()) &&
            ["י׳", "י״א", "י״ב"].includes(c.grade) &&
            teacher.remainingHours >= c.totalHours + c.bonusHours
        );

        for (const match of [eligibleMiddle, eligibleHigh]) {
          if (!match) continue;
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
            const canTeach =
              t.teachingLevel === "all" || t.teachingLevel === levelNeeded;
            return (
              canTeach &&
              t.remainingHours >= hoursForClass &&
              !alreadyAssigned.includes(t._id)
            );
          })
          .sort((a, b) => a.remainingHours - b.remainingHours);

        for (
          let i = 0;
          i < requiredTeachers && i < suitableTeachers.length;
          i++
        ) {
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
  } catch (err) {
    console.error("❌ Failed to generate assignment options:", err);
    res.status(500).json({
      message: "שגיאה ביצירת אפשרויות שיבוץ",
      error: err,
    });
  }
};

export const saveAssignments = async (req: Request, res: Response) => {
  try {
    const { assignments, user } = req.body;

    if (!assignments || !Array.isArray(assignments) || !user?._id) {
      res.status(400).json({ message: "Missing assignments or user" });
    } else {
      const docs = assignments.map((a: any) => ({
        teacher: a.teacher._id,
        class: a.class._id,
        hours: a.hours,
        coordinator: user._id,
      }));

      await AssignmentModel.insertMany(docs);
      res.status(201).json({ message: "Assignments saved successfully" });
    }
  } catch (err) {
    console.error("❌ Failed to save assignments:", err);
    res.status(500).json({ message: "שגיאה בשמירת השיבוצים", error: err });
  }
};

export const getSavedAssignments = async (req: Request, res: Response) => {
  try {
    const user = req.body.user;
    const coordinatorId = user._id;

    const assignments = await AssignmentModel.find()
      .populate({
        path: "class",
        match: { coordinator: coordinatorId },
        populate: { path: "category" },
      })
      .populate("teacher");

    const filtered = assignments.filter((a) => a.class !== null);

    const mapped = filtered.map((a) => {
      const teacher = a.teacher as any;
      const schoolClass = a.class as any;

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
  } catch (err) {
    res
      .status(500)
      .json({ message: "שגיאה בטעינת שיבוצים שמורים", error: err });
  }
};

export const deleteAssignmentsByCoordinator = async (
  req: Request,
  res: Response
) => {
  try {
    const { user } = req.body;
    if (!user?._id) res.status(400).json({ message: "חסר מזהה משתמש" });
    else {
      await AssignmentModel.deleteMany({ coordinator: user._id });
      res.json({ message: "השיבוצים נמחקו בהצלחה" });
    }
  } catch (err) {
    console.error("שגיאה במחיקת השיבוצים", err);
    res.status(500).json({ message: "שגיאה במחיקה", error: err });
  }
};

export const saveAssignmentMapToMongo = async (req: Request, res: Response) => {
  try {
    const { title, assignments } = req.body;

    if (!title || !assignments?.length)
      res.status(400).json({ message: "חסרים נתונים לשמירה" });
    else {
      const cleaned = assignments.map((a: any) => ({
        teacherName: a.teacher.fullName,
        className: a.class.name,
        hours: a.hours,
      }));

      const saved = await SavedAssignment.create({
        title,
        assignments: cleaned,
      });

      res.status(201).json({ message: "השיבוץ נשמר", map: saved });
    }
  } catch (err) {
    console.error("❌ שגיאה בשמירה:", err);
    res.status(500).json({ message: "שגיאה בשמירת המידע", error: err });
  }
};

export const getAllSavedAssignmentMaps = async (
  req: Request,
  res: Response
) => {
  try {
    const maps = await SavedAssignment.find().sort({ createdAt: -1 }).lean();
    res.json(maps);
  } catch (err) {
    console.error("❌ שגיאה בטעינת שיבוצים שמורים:", err);
    res.status(500).json({ message: "שגיאה בטעינת השיבוצים", error: err });
  }
};

export const deleteSavedAssignmentMap = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) res.status(400).json({ message: "לא התקבל מזהה למחיקה" });
    else {
      await SavedAssignment.findByIdAndDelete(id);
      res.json({ message: "השיבוץ נמחק בהצלחה" });
    }
  } catch (err) {
    console.error("❌ שגיאה במחיקת שיבוץ:", err);
    res.status(500).json({ message: "שגיאה במחיקת השיבוץ", error: err });
  }
};
