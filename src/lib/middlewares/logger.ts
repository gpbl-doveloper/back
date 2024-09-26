import morgan, { StreamOptions } from "morgan";
import logger from "jet-logger";
import { Request } from "express";

// ANSI 색상 코드 적용 함수
const colorizeStatus = (status: number) => {
  if (status >= 500) {
    return `\x1b[31m${status}\x1b[0m`; // 빨간색 (500번대 에러)
  } else if (status >= 400) {
    return `\x1b[33m${status}\x1b[0m`; // 노란색 (400번대 에러)
  } else if (status >= 300) {
    return `\x1b[36m${status}\x1b[0m`; // 청록색 (300번대 리다이렉션)
  } else if (status >= 200) {
    return `\x1b[32m${status}\x1b[0m`; // 초록색 (200번대 성공)
  }
  return `\x1b[37m${status}\x1b[0m`; // 흰색 (기타)
};

// Morgan이 로그를 Jet-Logger로 보내도록 설정
const stream: StreamOptions = {
  write: (message: string) => logger.info(message.trim()),
};

// environment === prod ? 'combined' : 'dev'
const morganFormat =
  process.env.NODE_ENV === "production"
    ? `:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" \nquery :query \nbody :body`
    : `:method :url :status :response-time ms - :res[content-length]  \nquery :query \nbody :body`;

morgan.token("body", (req: Request) => {
  return JSON.stringify(req.body); // 요청 본문 데이터를 JSON 문자열로 변환
});

morgan.token("query", (req: Request) => {
  return JSON.stringify(req.query); // 요청 쿼리 데이터를 JSON 문자열로 변환
});

morgan.token("status", (req, res) => {
  const status = res.statusCode;
  return colorizeStatus(status); // 상태 코드에 ANSI 색상 코드 적용
});

const morganMW = morgan(morganFormat, { stream });

export const logInfo = (message: string) => logger.info(message);
export const logError = (message: string) => logger.err(message);
export const logWarn = (message: string) => logger.warn(message);

export { logger, morganMW };
