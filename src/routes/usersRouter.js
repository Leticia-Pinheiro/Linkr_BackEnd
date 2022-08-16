import { Router } from "express";

import { sendUsers } from "../controllers/usersController.js";
import verifyToken from "../middlewares/verifyToken.js";

const usersRouter = Router();

usersRouter.get("/users", verifyToken, sendUsers);

export default usersRouter;
