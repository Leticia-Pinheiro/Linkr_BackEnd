import { Router } from "express";
import { updateLike } from "../controllers/likeController.js";
import verifyToken from "../middlewares/verifyToken.js";

const likeRouter = Router();

likeRouter.put('/like', verifyToken, updateLike);

export default likeRouter; 