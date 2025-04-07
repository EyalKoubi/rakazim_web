import express from "express";
import {
  deleteAssignmentsByCoordinator,
  getAssignmentOptions,
  getSavedAssignments,
  saveAssignments,
  saveAssignmentMapToMongo,
  getAllSavedAssignmentMaps,
  deleteSavedAssignmentMap,
} from "../controllers/assignmentController";

const router = express.Router();

router.post("/", getAssignmentOptions);
router.post("/save", saveAssignments);
router.post("/saved", getSavedAssignments);
router.post("/delete", deleteAssignmentsByCoordinator);
router.post("/save-map", saveAssignmentMapToMongo);
router.get("/saved-maps", getAllSavedAssignmentMaps);
router.delete("/saved-maps/:id", deleteSavedAssignmentMap);

export default router;
