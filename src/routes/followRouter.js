import { Router } from "express";

import verifyToken from "../middlewares/verifyToken.js";
import { newFollower } from "../controllers/followController.js";

const followRouter = Router();

followRouter.post("/follow", verifyToken, newFollower);

export default followRouter;
