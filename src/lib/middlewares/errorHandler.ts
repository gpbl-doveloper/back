import { Request, Response, NextFunction } from "express";
import HttpStatusCodes from "../../common/HttpStatusCodes";
import { logError } from "./logger";

const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = {
    // 에러가 발생했지만, 기본적인 에러 코드나 에러 메세지가 존재하지 않을 경우를 대비한 default 에러 코드 및 에러 메세지
    statusCode: err.statusCode || HttpStatusCodes.INTERNAL_SERVER_ERROR, // 500
    errorCode: err.errorCode || 0,
    message: err.message || "unknown error accrued",
  };

  logError(`(${error.errorCode}) ${error.message}`);

  return res
    .status(error.statusCode)
    .json({ message: error.message, errorCode: error.errorCode });
};

export default errorHandlerMiddleware;
