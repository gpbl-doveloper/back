import express from "express";
import { getDiary, addDiaryNote } from "../controllers/diaryController";
import paths from "../common/paths";
import auth from "../middlewares/auth";
import loginUser from "../middlewares/loginUser";

const router = express.Router();

/**
 * @swagger
 * /api/diary:
 *   get:
 *     summary: Retrieve diary note and photo for a specific dog on a given date
 *     description: Fetches a diary note and photo associated with a specific dog ID for the specified date. If no date is provided, it defaults to today.
 *     tags:
 *       - Diary
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the dog
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: The date to retrieve the diary data for, in YYYY-MM-DD format. Defaults to today if not provided.
 *     responses:
 *       200:
 *         description: Successfully retrieved diary note and photo
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
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     diaryNote:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         activities:
 *                           type: string
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         feedingTime:
 *                           type: integer
 *                           description: Feeding time, represented by an integer (0 - 3)
 *                         feedingAmt:
 *                           type: string
 *                           description: Feeding amount (All, Some, Nothing)
 *                         napStart:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                         napEnd:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                         note:
 *                           type: string
 *                         sentAt:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                         dogId:
 *                           type: integer
 *                         centerId:
 *                           type: integer
 *                     diaryPhoto:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         sentAt:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         dogId:
 *                           type: integer
 *                         centerId:
 *                           type: integer
 *       400:
 *         description: Missing required dog ID parameter or invalid input
 *       404:
 *         description: Diary data not found for the specified dog and date
 *       500:
 *         description: Internal server error
 */
// 다이어리 정보 라우트
router.get(paths.diary.get, auth, loginUser, getDiary);

/**
 * @swagger
 * /api/diary/add/note:
 *   post:
 *     summary: Create a new DiaryNote
 *     description: Creates a DiaryNote with details about the dog's activities, feeding, nap times, and additional notes. Requires centerId from the authenticated user and a dogId.
 *     tags:
 *       - Diary
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activities:
 *                 type: string
 *                 description: Activities the dog participated in
 *                 example: Played fetch, walked around the park
 *               feedingTime:
 *                 type: integer
 *                 description: Feeding time represented by an integer (0 - 3)
 *                 example: 2
 *               feedingAmt:
 *                 type: string
 *                 description: Feeding amount (All, Some, Nothing)
 *                 example: Some
 *               napStart:
 *                 type: string
 *                 format: date-time
 *                 description: Start time of the nap
 *                 example: 2024-11-14T12:00:00.000Z
 *               napEnd:
 *                 type: string
 *                 format: date-time
 *                 description: End time of the nap
 *                 example: 2024-11-14T12:45:00.000Z
 *               note:
 *                 type: string
 *                 description: Additional notes about the dog's behavior or condition
 *                 example: Had a great time playing, but seemed a bit tired afterward
 *               dogId:
 *                 type: integer
 *                 description: ID of the dog
 *                 example: 1
 *     responses:
 *       201:
 *         description: DiaryNote created successfully
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
 *                   example: DiaryNote created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     newDiaryNote:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 4
 *                         activities:
 *                           type: string
 *                           example: Played fetch, walked around the park
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-11-15T14:52:25.209Z
 *                         feedingTime:
 *                           type: integer
 *                           example: 2
 *                         feedingAmt:
 *                           type: string
 *                           example: Some
 *                         napStart:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-11-14T12:00:00.000Z
 *                         napEnd:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-11-14T12:45:00.000Z
 *                         note:
 *                           type: string
 *                           example: Had a great time playing, but seemed a bit tired afterward
 *                         sentAt:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                           example: null
 *                         dogId:
 *                           type: integer
 *                           example: 1
 *                         centerId:
 *                           type: integer
 *                           example: 1
 *       400:
 *         description: Missing required dogId or centerId in request body
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
 *                   example: dogId and centerId are required
 *       403:
 *         description: CenterId Missing in authenticated user data
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
 *                   example: CenterId Missing
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
// * 다이어리 Note 업로드 라우트
router.post(paths.diary.addNote, auth, loginUser, addDiaryNote);

/**
 * 다이어리 Note 보내기 라우트
 */
router.post(paths.diary.sendNote, addDiaryNote);

/**
 * 다이어리 Photo 보내기 라우트
 */
router.post(paths.diary.sendPhoto, addDiaryNote);

export default router;
