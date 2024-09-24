import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// app.use(cors()); // CORS 설정
app.use(express.json()); // JSON 요청 파싱
app.use(express.urlencoded({ extended: false })); // URL 인코딩된 데이터 파싱 (HTML Form)
app.use(express.static("public")); // 정적 파일 제공 (public 폴더에 있는 파일들을 제공)
app.use(cookieParser()); // 쿠키 파싱
app.use(morgan("dev")); // HTTP 요청 로깅
// app.use(helmet());// 보안 관련 헤더 설정

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
