import { Response } from "express";
import { logError } from "../lib/middlewares/logger";

// 성공 응답 형식
export const successResponse = (
  res: Response,
  data: any,
  message = "Success"
) => {
  return res.status(200).json({
    status: "success",
    message,
    data,
  });
};

// 에러 응답 형식
export const errorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  errorCode: number
) => {
  logError(`(${errorCode}) ${message}`); // `(0) Internal Server Error`
  return res.status(statusCode).json({
    status: "error",
    message,
    errorCode,
  });
};
