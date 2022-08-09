import { Router } from "express";

import { validateSchema } from "../middlewares/schemasValidator.js";
import signupSchema from "../schemas/signupSchema.js";
import { signupUser } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/signup", validateSchema(signupSchema), signupUser);

export default authRouter;
