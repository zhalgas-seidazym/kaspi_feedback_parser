import {chromium} from "playwright";
import axios from "axios";
import express from "express";

import {kaspiQueue} from "../../config/queue";
import ReviewRepository from "../../repositories/review-repository";

class FetchKaspiFeedbacks {
    private reviewRepository: ReviewRepository;

    constructor() {
        this.reviewRepository = new ReviewRepository();
    }

    async createQueue(req: express.Request, res: express.Response) {
        const {login, password, type, isCommented} = req.body;
        const cookies = await this.getKaspiCookies(login, password);
        let response: any;
        if (cookies) {
            await this.reviewRepository.deleteAllByUsername(login);
            response = await this.fetchKaspiFeedbacks(login, cookies, type, isCommented);
            console.log("fetched data", response);
        }
        return res.status(200).json(response);
    }

    async getKaspiCookies(login: string, password: string) {
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();

        try {
            await page.goto('https://idmc.shop.kaspi.kz/login');

            await page.fill('#user_email_field', login);
            await page.click('.button.is-primary');
            await page.waitForSelector('#password_field');

            await page.fill('#password_field', password);
            await page.click('.button.is-primary');
            await page.waitForTimeout(5000); // Ждём загрузку

            // Получаем куки
            const cookies = await page.context().cookies();
            return cookies;
        } catch (error) {
            console.error('Ошибка логина:', error);
            return null;
        } finally {
            await browser.close();
        }
    }


    async fetchKaspiFeedbacks(
        login: string,
        cookies: any,
        type: "all" | "negative" | "positive" | "picture",
        isCommented: boolean
    ) {
        // Generate URLs for later processing
        let urls: string[] = [];
        let count: number;
        const cookieString = cookies.map((c: any) => `${c.name}=${c.value}`).join('; ');

        try {
            const response = await axios.get(`https://kaspi.kz/yml/creview/rest/misc/merchant/BUGA/reviews/count/period?id=${type}&days=90&isCommented=${isCommented}`, {
                headers: {
                    'Cookie': cookieString,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    'Accept': 'application/json',
                    'Referer': 'https://kaspi.kz/',
                    'Origin': 'https://kaspi.kz',
                }
            });

            count = response.data.data;
        } catch (error) {
            console.error("Ошибка при запросе:", error);
            return null;
        }

        for (let i = 0; i < Math.ceil(count / 50); i++) {
            urls.push(`https://kaspi.kz/yml/creview/rest/misc/merchant/BUGA/reviews/period?id=${type}&days=90&limit=50&page=${i}&isCommented=${isCommented}`);
        }

        // Add URLs to BullMQ queue
        for (const url of urls) {
            await kaspiQueue.add("fetch-feedback", { login, url, cookieString });
        }

        return { message: "Feedback fetching has been queued" };
    }
}

export default FetchKaspiFeedbacks;