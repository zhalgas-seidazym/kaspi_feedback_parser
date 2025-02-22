import express from "express";

import FetchKaspiFeedbacks from "../controllers/fetch-controller";

const router = express.Router();
const fetchController = new FetchKaspiFeedbacks();

router.post('/api/get-feedbacks', async (req: express.Request, res: express.Response): Promise<any> => fetchController.createQueue(req, res));

export default router;