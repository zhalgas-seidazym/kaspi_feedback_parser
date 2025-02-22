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
const redis_1 = __importDefault(require("../config/redis"));
class RedisService {
    constructor() {
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.redis) {
                this.redis = yield (0, redis_1.default)();
            }
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.init();
            return yield this.redis.get(key);
        });
    }
    set(key_1, value_1) {
        return __awaiter(this, arguments, void 0, function* (key, value, expiry = 300) {
            yield this.init();
            const serializedValue = typeof value === 'object' ? JSON.stringify(value) : value;
            return yield this.redis.set(key, serializedValue, 'EX', expiry);
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.init();
            return yield this.redis.del(key);
        });
    }
    exists(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.init();
            return yield this.redis.exists(key);
        });
    }
    enqueue(queue, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redis.lpush(queue, JSON.stringify(data));
        });
    }
    dequeue(queue) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.redis.rpop(queue);
            return data ? JSON.parse(data) : null;
        });
    }
}
exports.default = RedisService;
