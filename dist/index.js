"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = __importDefault(require("./config/config"));
const fetch_route_1 = __importDefault(require("./api/routes/fetch-route"));
const db_1 = __importDefault(require("./config/db"));
const app = (0, express_1.default)();
(0, db_1.default)();
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(fetch_route_1.default);
const PORT = config_1.default.port || 8000;
app.listen(PORT, () => {
    console.log(`Server started on port 8000`);
});
