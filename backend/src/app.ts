import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import teacherRoutes from "./routers/teacherRoutes";
import assigmentRout from "./routers/assignmentRouters";
import schoolClassRoutes from "./routers/schoolClassRoutes";
import classCategoryRoutes from "./routers/classCategoryRoutes";
import authRoutes from "./routers/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());
app.use("/api/teachers", teacherRoutes);
app.use("/api/assigment", assigmentRout);
app.use("/api/classes", schoolClassRoutes);
app.use("/api/categories", classCategoryRoutes);
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(async () => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
  });
