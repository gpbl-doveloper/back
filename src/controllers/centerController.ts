import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { asyncWrapper } from "../middlewares/async";
import { successResponse } from "../common/response";
import { CustomError } from "../lib/error/customError";
import ErrorCode from "../lib/error/errorCode";

export const createCenter = asyncWrapper(
  async (req: Request, res: Response) => {
    const userId = req.loginUser?.id;
    const { name, phone, description, address } = req.body;

    const createdCenter = await prisma.center.create({
      data: {
        name,
        phone: phone || "",
        description: description || "",
        address: address || "",
        user: { connect: { id: userId } },
      },
    });

    successResponse(
      res,
      { center: createdCenter },
      "Center created successfully"
    );
  }
);

export const getCenterById = asyncWrapper(
  async (req: Request, res: Response) => {
    const centerId = Number(req.params.id);

    const center = await prisma.center
      .findUniqueOrThrow({
        where: { id: centerId },
        include: { files: true },
      })
      .catch(() => {
        throw Error("Center Not Found");
      });

    if (!center) {
      throw new Error("Center not found");
    }

    successResponse(res, { center }, "Center retrieved successfully");
  }
);

export const updateCenter = asyncWrapper(
  async (req: Request, res: Response) => {
    const centerId = Number(req.params.id);
    const { name, phone, description, address } = req.body;

    // Build the update data dynamically
    const updateData: Record<string, any> = {};
    if (name !== undefined && name !== null) updateData.name = name;
    if (phone !== undefined && phone !== null) updateData.phone = phone;
    if (description !== undefined && description !== null)
      updateData.description = description;
    if (address !== undefined && address !== null) updateData.address = address;

    if (Object.keys(updateData).length === 0) {
      throw new Error("No valid fields provided for update");
    }

    const updatedCenter = await prisma.center.update({
      where: { id: centerId },
      data: updateData,
      include: { files: true },
    });

    successResponse(
      res,
      { center: updatedCenter },
      "Center updated successfully"
    );
  }
);

export const deleteCenter = asyncWrapper(
  async (req: Request, res: Response) => {
    const centerId = Number(req.params.id);

    // Check if the center exists
    const center = await prisma.center.findUnique({ where: { id: centerId } });
    if (!center) {
      throw new Error("Center not found");
    }

    // Delete the center
    await prisma.center.delete({
      where: { id: centerId },
    });

    successResponse(res, null, "Center deleted successfully");
  }
);
