import { Router } from "express";
import { publishPost } from "../controllers/timelineControllers.js";
import { validateSchema } from "../middlewares/schemasValidator.js";
import postSchema from "../schemas/postSchema.js";

const timelineRouter = Router();

timelineRouter.post('/timeline', validateSchema(postSchema), publishPost);

export default timelineRouter;