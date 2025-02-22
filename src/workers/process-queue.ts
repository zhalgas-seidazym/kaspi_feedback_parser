import { Worker } from "bullmq";
import axios from "axios";

import connectToRedis from "../config/redis";
import Review from "../models/Review";
import BaseRepository from '../repositories/base-repository';
import connectToDB from "../config/db";


const baseRepo = new BaseRepository(Review)

const startWorker = async () => {
    connectToDB();
    const redisConnection = await connectToRedis();

    const worker = new Worker(
        "kaspi-feedback-queue",
        async (job) => {
            const { login, url, cookieString } = job.data;

            try {
                const response = await axios.get(url, {
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
                    await baseRepo.create({
                        username: login,
                        object: feedback
                    });
                }

                console.log(`Processed job ${job.id}`);
            } catch (error) {
                console.error(`Error processing job ${job.id}:`, error);
            }
        },
        { connection: redisConnection }
    );

    console.log("Worker started");
};

startWorker();
