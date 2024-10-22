import express, { Request, Response } from "express";
import paths from "../common/paths";
import auth from "../middlewares/auth";
import { login, signup } from "../controllers/authController";

const router = express.Router();

/**
 * signup router
 */
router.post(paths.auth.signup, auth, signup);

/**
 * login router
 */
router.post(paths.auth.login, auth, login);

export default router;
