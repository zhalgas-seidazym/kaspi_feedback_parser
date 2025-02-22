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
const bullmq_1 = require("bullmq");
const axios_1 = __importDefault(require("axios"));
const redis_1 = __importDefault(require("../config/redis"));
const Review_1 = __importDefault(require("../models/Review"));
const base_repository_1 = __importDefault(require("../repositories/base-repository"));
const db_1 = __importDefault(require("../config/db"));
const baseRepo = new base_repository_1.default(Review_1.default);
const startWorker = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, db_1.default)();
    const redisConnection = yield (0, redis_1.default)();
    const worker = new bullmq_1.Worker("kaspi-feedback-queue", (job) => __awaiter(void 0, void 0, void 0, function* () {
        const { login, url, cookieString } = job.data;
        try {
            const response = yield axios_1.default.get(url, {
                headers: {
                    'Cookie': cookieString,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    'Accept': 'application/json',
                    'Referer': 'https://kaspi.kz/',
                    'Origin': 'https://kaspi.kz',
                },
            });
            const feedbacks = response.data.data;
            for (const feedback of feedbacks) {
                yield baseRepo.create({
                    username: login,
                    object: feedback
                });
            }
            console.log(`Processed job ${job.id}`);
        }
        catch (error) {
            console.error(`Error processing job ${job.id}:`, error);
        }
    }), { connection: redisConnection });
    console.log("Worker started");
});
startWorker();
