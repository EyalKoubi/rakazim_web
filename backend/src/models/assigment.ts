import mongoose, { Schema, Document } from "mongoose";

export interface IAssignment extends Document {
  teacher: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  hours: number;
}

const AssignmentSchema: Schema = new Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SchoolClass",
    required: true,
  },
  hours: { type: Number, required: true },
  coordinator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model<IAssignment>("Assignment", AssignmentSchema);
