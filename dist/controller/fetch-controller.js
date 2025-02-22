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
const playwright_1 = require("playwright");
const axios_1 = __importDefault(require("axios"));
class FetchKaspiFeedbacks {
    constructor() {
    }
    getKaspiCookies(login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const browser = yield playwright_1.chromium.launch({ headless: true });
            const page = yield browser.newPage();
            try {
                yield page.goto('https://idmc.shop.kaspi.kz/login');
                yield page.fill('#user_email_field', login);
                yield page.click('.button.is-primary');
                yield page.waitForSelector('#password_field');
                yield page.fill('#password_field', password);
                yield page.click('.button.is-primary');
                yield page.waitForTimeout(5000); // Ждём загрузку
                // Получаем куки
                const cookies = yield page.context().cookies();
                return cookies;
            }
            catch (error) {
                console.error('Ошибка логина:', error);
                return null;
            }
            finally {
                yield browser.close();
            }
        });
    }
    fetchKaspiFeedbacks(cookies, type, isCommented) {
        return __awaiter(this, void 0, void 0, function* () {
            const cookieString = cookies.map((c) => `${c.name}=${c.value}`).join('; ');
            let url = `https://kaspi.kz/yml/creview/rest/misc/merchant/BUGA/reviews/count/period?id=${type}&days=90&isCommented=${isCommented}`;
            let count;
            try {
                const response = yield axios_1.default.get(url, {
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
            }
            catch (error) {
                console.error('Ошибка при запросе:', error);
                return null;
            }
            let data = [];
            try {
                for (let i = 0; i < Math.ceil(count / 50); i++) {
                    url = `https://kaspi.kz/yml/creview/rest/misc/merchant/BUGA/reviews/period?id=${type}&days=90&limit=50&page=${i}&isCommented=${isCommented}`;
                    const response = yield axios_1.default.get(url, {
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
            }
            catch (error) {
                console.error('Ошибка при запросе:', error);
                return null;
            }
        });
    }
}
exports.default = FetchKaspiFeedbacks;
