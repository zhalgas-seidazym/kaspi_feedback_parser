"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewScheme = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
    },
    object: {
        type: Object,
        required: true,
    }
});
const Review = mongoose_1.default.model('Review', reviewScheme);
exports.default = Review;
