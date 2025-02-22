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
exports.kaspiQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = __importDefault(require("./redis"));
let kaspiQueue;
const initQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    const redisConnection = yield (0, redis_1.default)();
    exports.kaspiQueue = kaspiQueue = new bullmq_1.Queue("kaspi-feedback-queue", {
        connection: redisConnection,
    });
    console.log("Kaspi feedback queue initialized.");
});
initQueue().catch(console.error);
