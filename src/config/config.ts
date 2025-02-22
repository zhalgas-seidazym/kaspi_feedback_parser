import dotenv from 'dotenv';
import path from 'path';

const BaseDir = path.resolve(__dirname, '..', '..');

dotenv.config({path: path.join(BaseDir, '.env')});

export default {
    baseDir: BaseDir,
    mongodb: process.env.MONGODB_URI,
    port: process.env.PORT,
    redisHost: process.env.REDIS_HOST,
    redisDatabase: parseInt(process.env.REDIS_DATABASE || '0'),
    redisPort: parseInt(process.env.REDIS_PORT || '0'),
    redisPassword: process.env.REDIS_PASSWORD,
};