import express from "express";
// import {register,login, getMe} from '../controllers/auth.controller.js'
import * as authController from "../controllers/auth.controller.js";
import {
  registerSchema,
  loginSchema,
  validate,
} from "../validator/validator.js";
import authenMiddleware from "../middlewares/authen.middleware.js";
const authRoute = express.Router();

authRoute.post("/login", validate(loginSchema), authController.login);
authRoute.post(
  "/register",
  validate(registerSchema),
  authController.registerYup
);
authRoute.get("/me", authenMiddleware, authController.getMe);

export default authRoute;
