import { Request, Response } from "express";
import { storageService } from "../lib/storage";
import * as fs from "fs";
import { File } from "@prisma/client";
import { asyncWrapper } from "../middlewares/async";
import prisma from "../lib/prisma";
import { successResponse } from "../common/response";
import { CustomError } from "../lib/error/customError";
import ErrorCode from "../lib/error/errorCode";
import dateFormater from "../utils/dateFormater";

export const uploadFiles = asyncWrapper(async (req: Request, res: Response) => {
  const centerId = req.loginUser?.centerId;
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    throw new CustomError(ErrorCode.NO_FILES_UPLOADED);
  }

  const uploadResults: File[] = [];

  // upload each file to storageService
  for (const file of files) {
    const filePath = file.path;
    const destination = `uploads/${centerId}/${dateFormater(new Date())}/${
      file.filename
    }`; // example: uploads/1/2024-03-15/1715718700000_1.jpg
    const location = await storageService.uploadFile(filePath, destination);
    const newFile = await prisma.file.create({
      data: {
        fileKey: destination,
        fileURL: location,
        center: { connect: { id: centerId } },
      },
    });

    uploadResults.push(newFile);

    // unlink temp file
    fs.unlinkSync(filePath);
  }

  successResponse(res, { files: uploadResults });
});

export const getFiles = asyncWrapper(async (req: Request, res: Response) => {
  const { date } = req.query;
  const dateMidnight = new Date(date ? (date as string) : Date()); // default: today
  dateMidnight.setHours(0, 0, 0, 0); // set time to midnight

  const files = await prisma.file.findMany({
    where: {
      centerId: req.loginUser?.centerId,
      createdAt: {
        gte: dateMidnight,
      },
    },
  });
  successResponse(res, { files });
});
