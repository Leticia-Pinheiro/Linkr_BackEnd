import { Router } from "express";
import {
	publishPost,
	getPosts,
	getPostsFromUser,
	deletePost,
	getPostsFromHashtag,
	getHashtags
} from "../controllers/timelineControllers.js";
import { validateSchema } from "../middlewares/schemasValidator.js";
import postSchema from "../schemas/postSchema.js";
import verifyToken from "../middlewares/verifyToken.js";

const timelineRouter = Router();

timelineRouter.post("/timeline", verifyToken, validateSchema(postSchema), publishPost);

timelineRouter.get("/posts/:id", verifyToken, getPostsFromUser);

timelineRouter.get("/posts", verifyToken, getPosts);

timelineRouter.delete("/posts/:id", verifyToken, deletePost);

timelineRouter.get("/hashtag/:hashtag", verifyToken, getPostsFromHashtag);

timelineRouter.get("/hashtags",verifyToken, getHashtags);

export default timelineRouter;
