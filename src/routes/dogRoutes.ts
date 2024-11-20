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
import { upload } from "../middlewares/multerConfig";

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
// TODO: update files
router.post(
  paths.dog.add,
  auth,
  loginUser,
  upload.array("files", 100),
  createDog
);

/**
 * @swagger
 * /api/dog/all:
 *   get:
 *     summary: Retrieve a list of all dogs owned by the current user
 *     description: Fetch a list of all dogs belonging to the logged-in user. Only users with the "PARENT" role can access this endpoint.
 *     tags:
 *       - Dog
 *     responses:
 *       200:
 *         description: Dogs retrieved successfully
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
 *                   example: Dogs retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     dogs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           img:
 *                             type: string
 *                             example: ""
 *                           name:
 *                             type: string
 *                             example: billy
 *                           sex:
 *                             type: string
 *                             example: Female
 *                           isNeutered:
 *                             type: boolean
 *                             example: true
 *                           bod:
 *                             type: string
 *                             format: date-time
 *                             example: 2022-08-09T00:00:00.000Z
 *                           breed:
 *                             type: string
 *                             example: retriever
 *                           medication:
 *                             type: string
 *                             example: ""
 *                           lastNoteAt:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                             example: null
 *                           lastPicsAt:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                             example: null
 *                           ownerId:
 *                             type: integer
 *                             example: 1
 *       403:
 *         description: User is not authorized to access this resource
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 3002
 *                 statusCode:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: Not a parent
 */
// Get a list of all dogs
router.get(paths.dog.get, auth, loginUser, getDogs);

/**
 * @swagger
 * /api/dog/info/{id}:
 *   get:
 *     summary: Retrieve dog information
 *     description: Fetch detailed information of a specific dog by its ID.
 *     tags:
 *       - Dog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the dog to retrieve
 *     responses:
 *       200:
 *         description: Dog retrieved successfully
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
 *                   example: Dog retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     dog:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         img:
 *                           type: string
 *                           example: ""
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
 *                           example: 2022-08-09T00:00:00.000Z
 *                         breed:
 *                           type: string
 *                           example: retriever
 *                         medication:
 *                           type: string
 *                           example: ""
 *                         lastNoteAt:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                           example: null
 *                         lastPicsAt:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                           example: null
 *                         ownerId:
 *                           type: integer
 *                           example: 1
 *       404:
 *         description: Dog not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Dog not found
 */
// Get a specific dog by ID
router.get(paths.dog.info, auth, getDog);

// Update a specific dog by ID
router.put(paths.dog.update, auth, loginUser, updateDog);

// Delete a specific dog by ID
router.delete(paths.dog.delete, deleteDog);

/**
 * @swagger
 * /api/dog/reservations/today:
 *   get:
 *     summary: Get today's reserved dogs
 *     description: Retrieves a list of dogs reserved for today, including their diary and photo statuses.
 *     tags:
 *       - Dog
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved dog reservation statuses.
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
 *                   example: Dogs retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     dogsWithStatus:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: Dog's unique identifier.
 *                             example: 1
 *                           img:
 *                             type: string
 *                             description: Image URL for the dog.
 *                             example: ""
 *                           name:
 *                             type: string
 *                             description: Dog's name.
 *                             example: billy
 *                           sex:
 *                             type: string
 *                             description: Dog's sex.
 *                             example: Femail
 *                           isNeutered:
 *                             type: boolean
 *                             description: Indicates if the dog is neutered.
 *                             example: true
 *                           bod:
 *                             type: string
 *                             format: date-time
 *                             description: Dog's birth date.
 *                             example: 2022-08-09T00:00:00.000Z
 *                           breed:
 *                             type: string
 *                             description: Dog's breed.
 *                             example: retriever
 *                           medication:
 *                             type: string
 *                             description: Dog's medication details.
 *                             example: ""
 *                           lastNoteAt:
 *                             type: string
 *                             format: date-time
 *                             description: Timestamp of the last diary note.
 *                             example: null
 *                           lastPicsAt:
 *                             type: string
 *                             format: date-time
 *                             description: Timestamp of the last photo upload.
 *                             example: null
 *                           ownerId:
 *                             type: integer
 *                             description: Owner's unique identifier.
 *                             example: 1
 *                           diaryNoteStatus:
 *                             type: integer
 *                             description: Status of the diary note (e.g., 1 for "not started", 2 for "draft").
 *                             example: 1
 *                           diaryPhotoStatus:
 *                             type: integer
 *                             description: Status of the diary photo (e.g., 1 for "not started", 2 for "draft").
 *                             example: 1
 *                           diaryNoteId:
 *                             type: integer
 *                             description: Identifier of the associated diary note.
 *                             example: 2
 *                           photoLength:
 *                             type: integer
 *                             description: Number of photos uploaded for the dog.
 *                             example: 0
 */
// 당일 예약되어있는 강아지의 status 반환
router.get(paths.dog.reservationsToday, auth, loginUser, reservationsToday);

export default router;
