import morgan, { StreamOptions } from "morgan";
import logger from "jet-logger";
import { Request } from "express";

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

const morganMW = morgan(morganFormat, { stream });

export const logInfo = (message: string) => logger.info(message);
export const logError = (message: string) => logger.err(message);
export const logWarn = (message: string) => logger.warn(message);

export { logger, morganMW };
