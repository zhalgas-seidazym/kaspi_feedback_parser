import express from "express";

import FetchKaspiFeedbacks from "../controller/fetch-controller";

const router = express.Router();
const fetchController = new FetchKaspiFeedbacks();

router.post('/api/get-feedbacks', async (req: express.Request, res: express.Response): Promise<any> => {
    const {login, password, type, isCommented} = req.body;
    const cookies = await fetchController.getKaspiCookies(login, password);
    let response: any;
    if (cookies) {
        response = await fetchController.fetchKaspiFeedbacks(cookies, type, isCommented);
        console.log("fetched data", response.length)
    }
    return res.status(200).json({data: response});
})

export default router;