import {chromium} from "playwright";
import axios from "axios";


class FetchKaspiFeedbacks {
    constructor() {
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


    async fetchKaspiFeedbacks(cookies: any, type: "all" | "negative" | "positive" | "picture", isCommented: boolean) {
        const cookieString = cookies.map((c: any) => `${c.name}=${c.value}`).join('; ');

        let url = `https://kaspi.kz/yml/creview/rest/misc/merchant/BUGA/reviews/count/period?id=${type}&days=90&isCommented=${isCommented}`
        let count: number;
        try {
            const response = await axios.get(url, {
                headers: {
                    'Cookie': cookieString,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    'Accept': 'application/json',
                    'Referer': 'https://kaspi.kz/',
                    'Origin': 'https://kaspi.kz',
                }
            });

            console.log(response.data);
            count = response.data.data;
        } catch (error) {
            console.error('Ошибка при запросе:', error);
            return null;
        }

        let data: any[] = [];
        try {
            for (let i = 0; i < Math.ceil(count / 50); i++){
                url = `https://kaspi.kz/yml/creview/rest/misc/merchant/BUGA/reviews/period?id=${type}&days=90&limit=50&page=${i}&isCommented=${isCommented}`;
                const response = await axios.get(url, {
                    headers: {
                        'Cookie': cookieString,
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                        'Accept': 'application/json',
                        'Referer': 'https://kaspi.kz/',
                        'Origin': 'https://kaspi.kz',
                    }
                });
                data = data.concat(response.data.data);
            }
            return data;
        } catch (error) {
            console.error('Ошибка при запросе:', error);
            return null;
        }
    }
}

export default FetchKaspiFeedbacks;