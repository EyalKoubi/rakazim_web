"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const classCategoryController_1 = require("../controllers/classCategoryController");
const router = express_1.default.Router();
// /api/categories
router.post("/all", classCategoryController_1.getAllCategories); // GET all
router.get("/:id", classCategoryController_1.getCategoryById); // GET by ID
router.post("/", classCategoryController_1.createCategory); // POST create
router.put("/:id", classCategoryController_1.updateCategory); // PUT update
router.delete("/:id", classCategoryController_1.deleteCategory); // DELETE
router.post("/delete-all", classCategoryController_1.deleteAllCategories);
exports.default = router;
