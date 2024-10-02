import express from "express";
import { uploadFiles } from "../controllers/diaryController";
import { upload } from "../lib/middlewares/multerConfig";

const router = express.Router();

/**
 * 여러 파일 업로드 라우트
 * 한 번에 10개 파일만
 */
router.post("/upload", upload.array("files", 10), uploadFiles);

export default router;
