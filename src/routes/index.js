import { Router } from "express";

import authRouter from "./authRouter.js";
import timelineRouter from "./timelineRouter.js";
import likeRouter from "./likeRouter.js";
import usersRouter from "./usersRouter.js";
import followRouter from "./followRouter.js";

const router = Router();

router.use(authRouter);
router.use(timelineRouter);
router.use(likeRouter);
router.use(usersRouter);
router.use(followRouter);

export default router;
