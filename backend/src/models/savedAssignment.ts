import mongoose from "mongoose";

const savedAssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  assignments: [
    {
      teacherName: { type: String, required: true },
      className: { type: String, required: true },
      hours: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("SavedAssignment", savedAssignmentSchema);
