import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { asyncWrapper } from "../middlewares/async";
import { successResponse } from "../common/response";
import { CustomError } from "../lib/error/customError";
import ErrorCode from "../lib/error/errorCode";

export const getUserInfo = asyncWrapper(async (req: Request, res: Response) => {
  const userId = Number(req.params.id);

  if (!userId) {
    throw Error("User ID is required");
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      id: true,
      uid: false,
      name: true,
      role: true,
      phone: true,
      email: true,
      createdAt: false,
    },
  });

  successResponse(res, { user }, "User information retrieved successfully");
});

export const updateUserInfo = asyncWrapper(
  async (req: Request, res: Response) => {
    const userId = req.loginUser?.id;
    const { name, phone, email } = req.body;

    if (!userId) {
      throw Error("User is not logged in");
    }

    const updateData: Record<string, any> = {};
    if (name !== undefined && name !== null) updateData.name = name;
    if (phone !== undefined && phone !== null) updateData.phone = phone;
    if (email !== undefined && email !== null) updateData.email = email;

    if (Object.keys(updateData).length === 0) {
      throw Error("No valid fields provided for update");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        uid: false,
        name: true,
        role: true,
        phone: true,
        email: true,
        createdAt: false,
      },
    });

    successResponse(
      res,
      { user: updatedUser },
      "User information updated successfully"
    );
  }
);
