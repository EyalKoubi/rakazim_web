"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Routes for customer-related API endpoints (requires authentication)
const express_1 = __importDefault(require("express"));
const customerController_1 = require("../controllers/customerController");
const router = express_1.default.Router();
// GET /api/customers - Returns a filtered list of customers based on query (e.g. name)
router.get("/", customerController_1.getCustomers);
exports.default = router;
