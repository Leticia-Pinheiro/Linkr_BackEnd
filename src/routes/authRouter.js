import { Router } from "express";

import { validateSchema } from "../middlewares/schemasValidator.js";
import signupSchema from "../schemas/signupSchema.js";
import { signupUser } from "../controllers/authController.js";
import signinSchema from "../schemas/signinSchema.js";
import { signinUser } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/signup", validateSchema(signupSchema), signupUser);
authRouter.post("/signin", validateSchema(signinSchema), signinUser);

export default authRouter;
