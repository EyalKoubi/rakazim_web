import mongoose, { Schema, Document } from "mongoose";

export interface ITeacher extends Document {
  fullName: string;
  idNumber: string;
  professionalHours: number;
  dutyHours: number;
  teachingLevel: "middle" | "high" | "all";
}

const TeacherSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  idNumber: { type: String, required: true },
  professionalHours: { type: Number, required: true },
  dutyHours: { type: Number, required: true },
  teachingLevel: {
    type: String,
    enum: ["middle", "high", "all"],
    required: true,
  },
  coordinator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model<ITeacher>("Teacher", TeacherSchema);
