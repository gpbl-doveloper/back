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
 * 다이어리 목록 라우트
 */
router.get(paths.diary.get, auth, loginUser, getDiary);

/**
 * 다이어리 정보 라우트
 */
router.get(paths.diary.info, auth, loginUser, getDiaryInfo);

/**
 * 다이어리 Photo 업로드 라우트
 * //FIXME 파일업로드 없애기
 */
router.post(paths.diary.addPhoto, upload.array("files", 20), addDiary);

/**
 * 다이어리 Note 업로드 라우트
 */
router.post(paths.diary.addNote, upload.array("files", 20), addDiary);

router.post(paths.diary.sendPhoto, addDiary);
router.post(paths.diary.sendNote, addDiary);

export default router;
