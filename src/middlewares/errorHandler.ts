import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../common/response";
import { CustomError } from "../lib/error/customError";

const errorHandlerMiddleware = (
  err: CustomError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // res.status(error.statusCode).json({ message: error.message, errorCode: error.errorCode });

  if (err instanceof CustomError) {
    // CustomError 처리
    return errorResponse(res, err.statusCode, err.message, err.errorCode);
  }

  // 기본 에러 처리
  return errorResponse(res, 500, err.name + err.message, 0);
};

export default errorHandlerMiddleware;
