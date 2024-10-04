import multer from "multer";
import path from "path";
import fs from "fs";

// 업로드 폴더 경로 설정
const uploadsDir = path.join(__dirname, "../../uploads");

// 업로드 폴더가 존재하지 않으면 생성
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true }); // 디렉토리 트리를 안전하게 생성
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 고유한 이름 생성
  },
});

export const upload = multer({ storage });
