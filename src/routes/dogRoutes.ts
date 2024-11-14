import express from "express";
import {
  createDog,
  getDog,
  updateDog,
  deleteDog,
  getDogs,
  reservationsToday,
} from "../controllers/dogController";
import paths from "../common/paths";
import auth from "../middlewares/auth";
import loginUser from "../middlewares/loginUser";

const router = express.Router();

/**
 * @swagger
 * /api/dog/add:
 *   post:
 *     summary: Create a new dog profile
 *     description: Adds a new dog profile to the system with the provided details.
 *     tags:
 *       - Dog
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
 *                 description: Dog's name
 *                 example: billy
 *               sex:
 *                 type: string
 *                 description: Dog's gender (Male or Female)
 *                 example: Female
 *               isNeutered:
 *                 type: boolean
 *                 description: Indicates if the dog is neutered
 *                 example: true
 *               bod:
 *                 type: string
 *                 format: date
 *                 description: Dog's birthdate in YYYY-MM-DD format
 *                 example: 2022-08-09
 *               breed:
 *                 type: string
 *                 description: Dog's breed
 *                 example: retriever
 *     responses:
 *       200:
 *         description: Dog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Dog created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     dog:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: billy
 *                         sex:
 *                           type: string
 *                           example: Female
 *                         isNeutered:
 *                           type: boolean
 *                           example: true
 *                         bod:
 *                           type: string
 *                           format: date-time
 *                           example: "2022-08-09T00:00:00.000Z"
 *                         breed:
 *                           type: string
 *                           example: retriever
 *                         medication:
 *                           type: string
 *                           example: ""
 *                         lastNoteAt:
 *                           type: string
 *                           format: date-time
 *                           example: null
 *                         lastPicsAt:
 *                           type: string
 *                           format: date-time
 *                           example: null
 *                         ownerId:
 *                           type: integer
 *                           example: 1
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized, authentication required
 */
router.post(paths.dog.add, auth, loginUser, createDog);

// Get a list of all dogs
router.get(paths.dog.base, getDogs);

// Get a specific dog by ID
router.get(paths.dog.info, getDog);

// Update a specific dog by ID
router.put(paths.dog.update, auth, loginUser, updateDog);

// Delete a specific dog by ID
router.delete(paths.dog.delete, deleteDog);

// 당일 예약되어있는 강아지의 status 반환
router.get(paths.dog.reservationsToday, auth, loginUser, reservationsToday);

export default router;
