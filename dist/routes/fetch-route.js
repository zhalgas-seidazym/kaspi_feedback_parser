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
const express_1 = __importDefault(require("express"));
const fetch_controller_1 = __importDefault(require("../controller/fetch-controller"));
const router = express_1.default.Router();
const fetchController = new fetch_controller_1.default();
router.post('/api/get-feedbacks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, password, type, isCommented } = req.body;
    const cookies = yield fetchController.getKaspiCookies(login, password);
    let response;
    if (cookies) {
        response = yield fetchController.fetchKaspiFeedbacks(cookies, type, isCommented);
        console.log("fetched data", response.length);
    }
    return res.status(200).json({ data: response });
}));
exports.default = router;
