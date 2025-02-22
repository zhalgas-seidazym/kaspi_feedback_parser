import connectToRedis from "../config/redis";
import {Redis} from "ioredis";

class RedisService {
    protected redis!: Redis;

    constructor() {
    }

    private async init() {
        if (!this.redis) {
            this.redis = await connectToRedis();
        }
    }

    async get(key: string) {
        await this.init();
        return await this.redis.get(key);
    }

    async set(key: string, value: any, expiry: number = 300) {
        await this.init();
        const serializedValue = typeof value === 'object' ? JSON.stringify(value) : value;

        return await this.redis.set(key, serializedValue, 'EX', expiry);
    }

    async delete(key: string) {
        await this.init();
        return await this.redis.del(key);
    }

    async exists(key: string) {
        await this.init();
        return await this.redis.exists(key);
    }

    async enqueue(queue: string, data: any) {
        await this.redis.lpush(queue, JSON.stringify(data));
    }

    async dequeue(queue: string) {
        const data = await this.redis.rpop(queue);
        return data ? JSON.parse(data) : null;
    }
}

export default RedisService;