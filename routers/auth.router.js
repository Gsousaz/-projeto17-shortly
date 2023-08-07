import { Router } from "express";
import { signup, signin } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.get("/games", signup);
authRouter.post("/games", signin);

export default authRouter;