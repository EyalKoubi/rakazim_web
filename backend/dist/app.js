"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const teacherRoutes_1 = __importDefault(require("./routers/teacherRoutes"));
const assignmentRouters_1 = __importDefault(require("./routers/assignmentRouters"));
const schoolClassRoutes_1 = __importDefault(require("./routers/schoolClassRoutes"));
const classCategoryRoutes_1 = __importDefault(require("./routers/classCategoryRoutes"));
const authRoutes_1 = __importDefault(require("./routers/authRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
// Enable CORS and JSON body parsing
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/teachers", teacherRoutes_1.default);
app.use("/api/assigment", assignmentRouters_1.default);
app.use("/api/classes", schoolClassRoutes_1.default);
app.use("/api/categories", classCategoryRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}))
    .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
});
