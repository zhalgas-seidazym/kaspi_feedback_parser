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
const Review_1 = __importDefault(require("../models/Review"));
const base_repository_1 = __importDefault(require("./base-repository"));
const mongoose_1 = require("mongoose");
class ReviewRepository extends base_repository_1.default {
    constructor() {
        super(Review_1.default);
    }
    deleteAllByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!username) {
                    throw new mongoose_1.Error('Username is required');
                }
                return yield this.model.deleteMany({ username: username });
            }
            catch (error) {
                console.error('Error in delete:' + error.message);
                throw new mongoose_1.Error('Error in delete:' + error.message);
            }
        });
    }
}
exports.default = ReviewRepository;
