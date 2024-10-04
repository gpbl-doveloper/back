import express from "express";
import {
  addDiary,
  getDiaryInfo,
  getDiary,
} from "../controllers/diaryController";
import { upload } from "../middlewares/multerConfig";
import paths from "../common/paths";

const router = express.Router();

/**
 * 다이어리 목록 라우트
 */
router.get(paths.diary.get, getDiary);

/**
 * 다이어리 정보 라우트
 */
router.get(paths.diary.info, getDiaryInfo);

/**
 * 다이어리 업로드 라우트
 * //FIXME 파일업로드 없애기
 */
router.post(paths.diary.add, upload.array("files", 20), addDiary);

export default router;
