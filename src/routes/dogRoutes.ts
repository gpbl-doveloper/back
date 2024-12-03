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
 *     summary: Create a new dog
 *     description: Creates a new dog record, uploads associated files, and returns the created dog along with uploaded file details.
 *     tags:
 *       - Dog
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the dog
 *                 example: Billy
 *               sex:
 *                 type: string
 *                 description: Gender of the dog
 *                 example: Male
 *               isNeutered:
 *                 type: boolean
 *                 description: Whether the dog is neutered
 *                 example: true
 *               bod:
 *                 type: string
 *                 format: date
 *                 description: Birth date of the dog
 *                 example: 2022-08-09
 *               breed:
 *                 type: string
 *                 description: Breed of the dog
 *                 example: Retriever
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Images or files associated with the dog
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
 *                           example: 12
 *                         img:
 *                           type: string
 *                           example: https://dovelopers-bucket.s3.us-west-1.amazonaws.com/dogs/12/1732091646780.jpg
 *                         name:
 *                           type: string
 *                           example: Billy
 *                         sex:
 *                           type: string
 *                           example: Male
 *                         isNeutered:
 *                           type: boolean
 *                           example: true
 *                         bod:
 *                           type: string
 *                           format: date-time
 *                           example: 2022-08-09T00:00:00.000Z
 *                         breed:
 *                           type: string
 *                           example: Retriever
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
 *                         facefiles:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 31
 *                               fileKey:
 *                                 type: string
 *                                 example: dogs/12/1732091646780.jpg
 *                               fileURL:
 *                                 type: string
 *                                 example: https://dovelopers-bucket.s3.us-west-1.amazonaws.com/dogs/12/1732091646780.jpg
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                                 example: 2024-11-20T08:34:06.949Z
 *                               centerId:
 *                                 type: integer
 *                                 nullable: true
 *                                 example: null
 *                               diaryPhotoId:
 *                                 type: integer
 *                                 nullable: true
 *                                 example: null
 *                               dogId:
 *                                 type: integer
 *                                 example: 12
 *       400:
 *         description: Bad request
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
 *                   example: At least one file must be uploaded.
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/dog/update/{id}:
 *   patch:
 *     summary: Update a specific dog's information
 *     description: Updates the information of a specific dog by its ID. Only the fields provided in the request body will be updated.
 *     tags:
 *       - Dog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the dog to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the dog
 *                 example: Billy
 *               sex:
 *                 type: string
 *                 description: Gender of the dog
 *                 example: Female
 *               isNeutered:
 *                 type: boolean
 *                 description: Whether the dog is neutered
 *                 example: true
 *               bod:
 *                 type: string
 *                 format: date
 *                 description: Birth date of the dog
 *                 example: 2022-08-09
 *               breed:
 *                 type: string
 *                 description: Breed of the dog
 *                 example: Retriever
 *               medication:
 *                 type: string
 *                 description: Medication details for the dog
 *                 example: "Heartworm prevention meds"
 *     responses:
 *       200:
 *         description: Dog updated successfully
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
 *                   example: Dog updated successfully
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
 *                           example: "Heartworm prevention meds"
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
 *       400:
 *         description: Invalid request
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
 *                   example: No valid fields provided for update
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
 *       500:
 *         description: Internal server error
 */
// Update a specific dog by ID
router.put(paths.dog.update, auth, loginUser, updateDog);

/**
 * @swagger
 * /api/dog/delete/{id}:
 *   delete:
 *     summary: Delete a specific dog by ID
 *     description: Deletes a specific dog from the database by its ID.
 *     tags:
 *       - Dog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the dog to delete
 *     responses:
 *       200:
 *         description: Dog deleted successfully
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
 *                   example: Dog deleted successfully
 *                 data:
 *                   type: null
 *                   example: null
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
 *       500:
 *         description: Internal server error
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
 *                   example: Internal server error
 */
// Delete a specific dog by ID
router.delete(paths.dog.delete, auth, loginUser, deleteDog);

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
  *                           diaryPhotoId:
 *                             type: integer
 *                             description: Identifier of the associated diary photo.
 *                             example: 2

 */
// 당일 예약되어있는 강아지의 status 반환
router.get(paths.dog.reservationsToday, auth, loginUser, reservationsToday);

export default router;
