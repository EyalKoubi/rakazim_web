"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schoolClassController_1 = require("../controllers/schoolClassController");
const router = express_1.default.Router();
// /api/classes
router.post("/all", schoolClassController_1.getAllClasses); // GET all
router.get("/:id", schoolClassController_1.getClassById); // GET by ID
router.post("/", schoolClassController_1.createClass); // POST create
router.put("/:id", schoolClassController_1.updateClass); // PUT update
router.delete("/:id", schoolClassController_1.deleteClass); // DELETE
router.post("/delete-all", schoolClassController_1.deleteAllClasses);
exports.default = router;
