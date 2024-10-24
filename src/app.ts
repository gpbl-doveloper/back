import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { morganMW } from "./middlewares/logger";
import errorHandler from "./middlewares/errorHandler";
import admin from "firebase-admin";

dotenv.config();

// Firebase Admin SDK 초기화
const serviceAccount = require(process.env
  .FIREBASE_SERVICE_ACCOUNT_PATH as string);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET as string,
});

import paths from "./common/paths";
import BaseRouter from "./routes";
import auth from "./middlewares/auth";

const app: Express = express();
const port = process.env.PORT;

// middlewares
// app.use(cors()); // CORS 설정
app.use(express.json()); // JSON 요청 파싱
app.use(express.urlencoded({ extended: false })); // URL 인코딩된 데이터 파싱 (HTML Form)
app.use(express.static("public")); // 정적 파일 제공 (public 폴더에 있는 파일들을 제공)
app.use(cookieParser()); // 쿠키 파싱
app.use(morganMW); // HTTP 요청 로깅
// app.use(helmet());// 보안 관련 헤더 설정

app.get("/", auth, (req: Request, res: Response) => {
  // console.log(req.user); // if you want to check user status
  res.send("hello, world!");
});

// Add APIs, must be after middlewareres.send("hello, world!");
app.use(paths.base, BaseRouter);

// Add error handler, must be after routers
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
