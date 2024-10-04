import express from "express";
import { uploadFiles, getFiles } from "../controllers/pictureController";
import { upload } from "../middlewares/multerConfig";
import paths from "../common/paths";

const router = express.Router();

/**
 * 사진 목록 라우트
 * default: "오늘"
 */
router.get(paths.picture.get, getFiles);

/**
 * 여러 파일 업로드 라우트
 * 한 번에 100개 파일만
 */
router.post(paths.picture.upload, upload.array("files", 100), uploadFiles);

export default router;
