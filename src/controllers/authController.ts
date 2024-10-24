import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { asyncWrapper } from "../middlewares/async";
import { successResponse } from "../common/response";
import { CustomError } from "../lib/error/customError";
import ErrorCode from "../lib/error/errorCode";

export const signup = asyncWrapper(async (req: Request, res: Response) => {
  const req_user = req.user;
  const { name, role, phone } = req.body;

  // validate uid
  const u = await prisma.user.findFirst({ where: { uid: req_user?.uid } });
  if (u) throw new CustomError(ErrorCode.USER_ALREADY_EXIST);

  // create user
  const created_user = await prisma.user.create({
    data: { uid: req_user?.uid, name, role, phone, email: req_user?.email },
  });

  successResponse(res, {
    message: "User signed up successfully",
    user: created_user,
  });
});

export const login = asyncWrapper(async (req: Request, res: Response) => {
  const req_user = req.user;
  // validate uid
  const user = await prisma.user.findFirst({ where: { uid: req_user?.uid } });
  if (!user) throw new CustomError(ErrorCode.USER_NOT_EXIST);

  successResponse(res, { message: "User logged in successfully", user });
});
