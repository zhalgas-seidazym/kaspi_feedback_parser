import {Redis} from 'ioredis';

import config from './config';

const connectToRedis = async (): Promise<Redis> => {
    const redis = new Redis({
        host: config.redisHost,
        port: config.redisPort,
        db: config.redisDatabase,
        password: config.redisPassword,
        maxRetriesPerRequest: null
    });

    redis.on('connect', () => {
        console.log('Connected to Redis successfully');
    });

    redis.on('error', (err: Error) => {
        console.error('Redis connection error:', err);
    });

    return redis;
};

export default connectToRedis;