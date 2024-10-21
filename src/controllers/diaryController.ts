import { Request, Response } from "express";
import { storageService } from "../lib/storage";
import * as fs from "fs";
import { File } from "@prisma/client";
import prisma from "../lib/prisma";
import { asyncWrapper } from "../middlewares/async";
import { successResponse } from "../common/response";
import { CustomError } from "../lib/error/customError";
import ErrorCode from "../lib/error/errorCode";

export const getDiary = asyncWrapper(async (req: Request, res: Response) => {
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0); // 시간을 자정으로 설정
  const diaryList = await prisma.diary.findMany({
    where: {
      createdAt: {
        gte: todayMidnight, // 자정 이후로 생성된 레코드만 불러옴
      },
    },
    include: { files: true },
  });
  console.log(diaryList);
  successResponse(res, { diaryList });
});

export const getDiaryInfo = asyncWrapper(
  async (req: Request, res: Response) => {
    const diary = await prisma.diary.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: { files: true },
    });
    console.log(diary);
    successResponse(res, { diary });
  }
);

export const addDiary = asyncWrapper(async (req: Request, res: Response) => {
  //// TODO: file upload 없앨거임
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    throw new CustomError(ErrorCode.NO_FILES_UPLOADED);
  }

  const uploadResults: File[] = [];

  for (const file of files) {
    const filePath = file.path;
    const destination = `uploads/${file.filename}`;
    const newFile = await storageService.uploadFile(filePath, destination);

    uploadResults.push(newFile);

    // 임시 파일 삭제
    fs.unlinkSync(filePath);
  }

  //// diary 생성
  const newDiary = await prisma.diary.create({
    data: { content: req.body.content },
  });

  //// file update
  // TODO file upload 없어지면 id list 받을거임
  await prisma.file.updateMany({
    where: { id: { in: uploadResults.map((file) => file.id) } },
    data: { diaryId: newDiary.id },
  });

  successResponse(res, { diary: { ...newDiary, files: uploadResults } });
});
