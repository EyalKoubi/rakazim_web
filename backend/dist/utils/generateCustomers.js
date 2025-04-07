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
exports.generateFakeCustomers = void 0;
// Utility to generate and insert 1000 fake customer records into the database
const curtomer_1 = __importDefault(require("../models/curtomer"));
const faker_1 = require("@faker-js/faker");
const generateFakeCustomers = () => __awaiter(void 0, void 0, void 0, function* () {
    // Check if there are already 1000 or more customers in the DB
    const existing = yield curtomer_1.default.countDocuments();
    if (existing >= 1000)
        return;
    const customers = [];
    // Generate 1000 fake customers with realistic name, ID and phone
    for (let i = 0; i < 1000; i++) {
        customers.push({
            name: faker_1.faker.person.fullName(),
            id: faker_1.faker.number.int({ min: 100000000, max: 999999999 }), // Israeli-like 9-digit ID
            phone: faker_1.faker.helpers.replaceSymbols("+972-5##-###-####"), // Israeli phone format
        });
    }
    // Insert all generated customers into MongoDB
    yield curtomer_1.default.insertMany(customers);
    console.log("👥 1000 customers generated!");
});
exports.generateFakeCustomers = generateFakeCustomers;
