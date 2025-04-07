import mongoose, { Schema, Document } from "mongoose";

export interface IClassCategory extends Document {
  name: string;
  teacherCount: 1 | 2;
  coordinator: mongoose.Types.ObjectId;
}

const ClassCategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  teacherCount: { type: Number, enum: [1, 2], required: true },
  coordinator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model<IClassCategory>(
  "ClassCategory",
  ClassCategorySchema
);
