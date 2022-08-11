import { Router } from "express";
import {
	publishPost,
	getPosts,
	getPostsFromUser,
	deletePost,
} from "../controllers/timelineControllers.js";
import { validateSchema } from "../middlewares/schemasValidator.js";
import postSchema from "../schemas/postSchema.js";
import verifyToken from "../middlewares/verifyToken.js";

const timelineRouter = Router();

timelineRouter.post(
	"/timeline",
	verifyToken,
	validateSchema(postSchema),
	publishPost
);
timelineRouter.get("/posts", getPosts);

timelineRouter.get("/posts/:id", getPostsFromUser);

timelineRouter.delete("/posts/:id", verifyToken, deletePost);


export default timelineRouter;
