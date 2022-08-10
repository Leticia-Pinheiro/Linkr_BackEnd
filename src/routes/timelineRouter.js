import { Router } from "express";
import { publishPost, getPosts } from "../controllers/timelineControllers.js";
import { validateSchema } from "../middlewares/schemasValidator.js";
import postSchema from "../schemas/postSchema.js";

const timelineRouter = Router();

timelineRouter.post("/timeline", validateSchema(postSchema), publishPost);
timelineRouter.get("/posts", getPosts);

export default timelineRouter;
