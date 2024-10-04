import express from "express";
import { addDiary } from "../controllers/diaryController";
import { upload } from "../middlewares/multerConfig";

const router = express.Router();

/**
 * 다이어리 업로드 라우트
 */
router.post("/add", upload.array("files", 20), addDiary);

export default router;
