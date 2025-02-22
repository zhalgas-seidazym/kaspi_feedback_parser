"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const BaseDir = path_1.default.resolve(__dirname, '..', '..');
dotenv_1.default.config({ path: path_1.default.join(BaseDir, '.env') });
exports.default = {
    baseDir: BaseDir,
    mongodb: process.env.MONGODB_URI,
    port: process.env.PORT,
    redisHost: process.env.REDIS_HOST,
    redisDatabase: parseInt(process.env.REDIS_DATABASE || '0'),
    redisPort: parseInt(process.env.REDIS_PORT || '0'),
    redisPassword: process.env.REDIS_PASSWORD,
};
