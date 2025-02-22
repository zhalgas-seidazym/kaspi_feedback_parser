import redis from 'redis';

import config from './config';

const connectToRedis = async () => {
    const client = redis.createClient({
        socket: {
            host: config.redisHost,
            port: config.redisPort,
        },
        database: config.redisDatabase,
        password: config.redisPassword,
    });

    client.on('connect', () => {
        console.log('Connected to Redis successfully');
    });

    client.on('error', (err: Error) => {
        console.error('Redis connection error:', err);
    });

    await client.connect();
    return client;
};

module.exports = {
    connectToRedis
};