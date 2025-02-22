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
const ioredis_1 = require("ioredis");
const config_1 = __importDefault(require("./config"));
const connectToRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    const redis = new ioredis_1.Redis({
        host: config_1.default.redisHost,
        port: config_1.default.redisPort,
        db: config_1.default.redisDatabase,
        password: config_1.default.redisPassword,
        maxRetriesPerRequest: null
    });
    redis.on('connect', () => {
        console.log('Connected to Redis successfully');
    });
    redis.on('error', (err) => {
        console.error('Redis connection error:', err);
    });
    return redis;
});
exports.default = connectToRedis;
