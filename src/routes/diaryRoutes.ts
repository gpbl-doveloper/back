import express from "express";
import {
  addDiary,
  getDiaryInfo,
  getDiary,
} from "../controllers/diaryController";
import { upload } from "../middlewares/multerConfig";
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
 * 다이어리 Note 업로드 라우트
 */
router.post(paths.diary.addNote, upload.array("files", 20), addDiary);

/**
 * 다이어리 Note 보내기 라우트
 */
router.post(paths.diary.sendNote, addDiary);

/**
 * 다이어리 Photo 보내기 라우트
 */
router.post(paths.diary.sendPhoto, addDiary);

export default router;
