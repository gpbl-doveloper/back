import { Request, Response } from "express";
import { storageService } from "../lib/storage";
import * as fs from "fs";
import { File } from "@prisma/client";
import { asyncWrapper } from "../middlewares/async";
import prisma from "../lib/prisma";
import { successResponse } from "../common/response";
import { CustomError } from "../lib/error/customError";
import ErrorCode from "../lib/error/errorCode";

export const uploadFiles = asyncWrapper(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[]; // 여러 파일 배열

  if (!files || files.length === 0) {
    throw new CustomError(ErrorCode.NO_FILES_UPLOADED);
  }

  const uploadResults: File[] = [];

  // 각 파일을 스토리지 서비스에 업로드
  for (const file of files) {
    const filePath = file.path;
    const destination = `uploads/${file.filename}`;
    const newFile = await storageService.uploadFile(filePath, destination);

    uploadResults.push(newFile);

    // 임시 파일 삭제
    fs.unlinkSync(filePath);
  }

  successResponse(res, { files: uploadResults });
});

export const getFiles = asyncWrapper(async (req: Request, res: Response) => {
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0); // 시간을 자정으로 설정

  const files = await prisma.file.findMany({
    where: {
      createdAt: {
        gte: todayMidnight, // 자정 이후로 생성된 레코드만 불러옴
      },
    },
  });
  successResponse(res, { files });
});
