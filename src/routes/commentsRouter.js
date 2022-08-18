import { Router } from "express";

import {
	countComments,
	postComment,
} from "../controllers/commentController.js";
import verifyToken from "../middlewares/verifyToken.js";

const commentsRouter = Router();

commentsRouter.get("/comments/:id", verifyToken, countComments);

commentsRouter.post("/comments", verifyToken, postComment);

export default commentsRouter;
