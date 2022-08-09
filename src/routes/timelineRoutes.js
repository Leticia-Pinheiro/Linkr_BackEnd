import { Router } from "express";
import { publishPost } from "../controllers/timelineControllers.js";
import validateSchema from "../middlewares/validateSchema.js";
import postSchema from "../schemas/postSchema.js";

const timelineRoutes = Router();

timelineRoutes.post('/timeline', validateSchema(postSchema), publishPost);

export default timelineRoutes;