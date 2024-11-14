import express, { Request, Response } from "express";
import paths from "../common/paths";
import auth from "../middlewares/auth";
import { login, signup } from "../controllers/authController";

const router = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     description: Creates a new user account with the provided details.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's name
 *                 example: John Doe
 *               role:
 *                 type: string
 *                 description: User's role, such as "PARENT" or "CENTER"
 *                 example: PARENT
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *                 example: "9997778888"
 *     responses:
 *       200:
 *         description: User signed up successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User signed up successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     uid:
 *                       type: string
 *                       description: Firebase UID
 *                       example: "abcd1234"
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     role:
 *                       type: string
 *                       example: PARENT
 *                     phone:
 *                       type: string
 *                       example: "+1234567890"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-11-14T08:27:06.736Z"
 *                     centerId:
 *                       type: integer
 *                       example: null
 *       400:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: USER_ALREADY_EXIST
 */
router.post(paths.auth.signup, auth, signup);

/**
 * login router
 */
router.post(paths.auth.login, auth, login);

export default router;
