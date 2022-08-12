import { Router } from "express";

import { sendUsers } from "../controllers/usersController.js";

const usersRouter = Router();

usersRouter.get("/users", sendUsers);

export default usersRouter;
