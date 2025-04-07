"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assignmentController_1 = require("../controllers/assignmentController");
const router = express_1.default.Router();
router.post("/", assignmentController_1.getAssignmentOptions);
router.post("/save", assignmentController_1.saveAssignments);
router.post("/saved", assignmentController_1.getSavedAssignments);
router.post("/delete", assignmentController_1.deleteAssignmentsByCoordinator);
router.post("/save-map", assignmentController_1.saveAssignmentMapToMongo);
router.get("/saved-maps", assignmentController_1.getAllSavedAssignmentMaps);
router.delete("/saved-maps/:id", assignmentController_1.deleteSavedAssignmentMap);
exports.default = router;
