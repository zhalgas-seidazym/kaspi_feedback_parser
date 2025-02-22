import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import config from './config/config';
import router from './api/routes/fetch-route';
import connectToDB from "./config/db";

const app = express();
connectToDB();

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);


const PORT = config.port || 8000;
app.listen(PORT, () => {
    console.log(`Server started on port 8000`);
})
