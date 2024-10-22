import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { asyncWrapper } from "../middlewares/async";
import { successResponse } from "../common/response";
import { CustomError } from "../lib/error/customError";
import ErrorCode from "../lib/error/errorCode";

export const signup = asyncWrapper(async (req: Request, res: Response) => {
  const user = req.user;
  // TODO DB에 이미 있는 유저인지 아닌지 확인

  // TODO 추가로 회원 정보 저장을 원한다면 DB에 사용자 정보 저장 등의 작업 수행 가능

  console.log(user);
  successResponse(res, { message: "User signed up successfully", user });
});

export const login = asyncWrapper(async (req: Request, res: Response) => {
  const user = req.user;
  // TODO validate uid
  console.log(user);
  successResponse(res, { message: "User logged in successfully", user });
});
