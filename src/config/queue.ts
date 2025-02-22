import { Queue } from "bullmq";
import connectToRedis from "./redis";

let kaspiQueue: Queue;

const initQueue = async () => {
    const redisConnection = await connectToRedis();
    kaspiQueue = new Queue("kaspi-feedback-queue", {
        connection: redisConnection,
    });

    console.log("Kaspi feedback queue initialized.");
};

initQueue().catch(console.error);

export { kaspiQueue };
