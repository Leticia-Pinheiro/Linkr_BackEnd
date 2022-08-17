import { Router } from "express";

import { repost, countRepost } from "../controllers/repostController.js";

const repostRouter = Router();

repostRouter.post("/repost", repost);

repostRouter.get("/repost/:id", countRepost);

export default repostRouter;
