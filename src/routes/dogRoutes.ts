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

// Get a list of all dogs
router.get(paths.dog.base, getDogs);

// Get a specific dog by ID
router.get(paths.dog.info, getDog);

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
 *         description: A list of dogs reserved for today
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Response status
 *                 message:
 *                   type: string
 *                   description: Success message
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
 *                             description: Dog's unique ID
 *                           name:
 *                             type: string
 *                             description: Dog's name
 *                           sex:
 *                             type: string
 *                             description: Dog's sex (e.g., Male, Female)
 *                           isNeutered:
 *                             type: boolean
 *                             description: Neutering status
 *                           bod:
 *                             type: string
 *                             format: date-time
 *                             description: Date of birth
 *                           breed:
 *                             type: string
 *                             description: Dog's breed
 *                           medication:
 *                             type: string
 *                             description: Medication details if any
 *                           lastNoteAt:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                             description: Date of last diary note
 *                           lastPicsAt:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                             description: Date of last picture upload
 *                           ownerId:
 *                             type: integer
 *                             description: Owner's ID
 *                           diaryNote:
 *                             type: object
 *                             nullable: true
 *                             description: Diary note details
 *                             properties:
 *                               diaryNoteStatus:
 *                                 type: string
 *                                 description: Status of the diary note
 *                               id:
 *                                 type: integer
 *                                 description: Diary note ID
 *                               activities:
 *                                 type: string
 *                                 description: Activities noted
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                                 description: Date of diary creation
 *                               feedingTime:
 *                                 type: integer
 *                                 description: Feeding time
 *                               feedingAmt:
 *                                 type: string
 *                                 description: Amount fed
 *                               napStart:
 *                                 type: string
 *                                 format: date-time
 *                                 nullable: true
 *                                 description: Nap start time
 *                               napEnd:
 *                                 type: string
 *                                 format: date-time
 *                                 nullable: true
 *                                 description: Nap end time
 *                               note:
 *                                 type: string
 *                                 description: Additional notes
 *                               sentAt:
 *                                 type: string
 *                                 format: date-time
 *                                 nullable: true
 *                                 description: Submission date
 *                               dogId:
 *                                 type: integer
 *                                 description: Associated dog ID
 *                               centerId:
 *                                 type: integer
 *                                 description: Associated center ID
 *                           diaryPhoto:
 *                             type: object
 *                             nullable: true
 *                             description: Diary photo details
 *                             properties:
 *                               diaryPhotoStatus:
 *                                 type: string
 *                                 description: Status of the diary photo
 *                               pictures:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                                 description: List of photo URLs
 *       401:
 *         description: Unauthorized, authentication required
 */
// 당일 예약되어있는 강아지의 status 반환
router.get(paths.dog.reservationsToday, auth, loginUser, reservationsToday);

export default router;
