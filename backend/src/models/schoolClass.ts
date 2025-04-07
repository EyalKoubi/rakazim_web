import mongoose, { Schema, Document } from "mongoose";
import { IClassCategory } from "./classCategory";

export type Grade = "ז׳" | "ח׳" | "ט׳" | "י׳" | "י״א" | "י״ב";

export interface ISchoolClass extends Document {
  name: string;
  grade: Grade;
  category: mongoose.Types.ObjectId | IClassCategory;
}

const SchoolClassSchema: Schema = new Schema({
  name: { type: String, required: true },
  grade: {
    type: String,
    enum: ["ז׳", "ח׳", "ט׳", "י׳", "י״א", "י״ב"],
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClassCategory",
    required: true,
  },
  totalHours: { type: Number, default: 0, required: true },
  bonusHours: { type: Number, default: 0, required: true },
  coordinator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model<ISchoolClass>("SchoolClass", SchoolClassSchema);
