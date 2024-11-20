import { Request, Response } from "express";
import { storageService } from "../lib/storage";
import * as fs from "fs";
import { File, Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import { asyncWrapper } from "../middlewares/async";
import { successResponse } from "../common/response";
import { CustomError } from "../lib/error/customError";
import ErrorCode from "../lib/error/errorCode";
import { logError } from "../middlewares/logger";

export const getDiary = asyncWrapper(async (req: Request, res: Response) => {
  const { dog, date } = req.query;
  if (!dog) throw new CustomError(ErrorCode.DOG_QUERY_MISSING);

  const dateMidnight = new Date(date ? (date as string) : Date()); // default: today
  dateMidnight.setHours(0, 0, 0, 0); // set time to midnight
  const nextMidnight = new Date(dateMidnight);
  nextMidnight.setDate(nextMidnight.getDate() + 1);

  console.log(Number(dateMidnight), nextMidnight);

  const dogId = Number(dog);

  try {
    const [diaryPhoto, diaryNote] = await Promise.all([
      prisma.DiaryPhoto.findFirst({
        where: {
          dogId,
          sentAt: { not: null },
          createdAt: { gte: dateMidnight, lt: nextMidnight },
        },
      }),
      prisma.DiaryNote.findFirst({
        where: {
          dogId,
          sentAt: { not: null },
          createdAt: { gte: dateMidnight, lt: nextMidnight },
        },
      }),
    ]);

    console.log(dogId, diaryNote);

    successResponse(res, {
      diaryNote,
      diaryPhoto,
    });
  } catch (error: any) {
    logError(`Error fetching diary data: ${error.message}`);
    throw new CustomError(ErrorCode.INTERNAL_SERVER_ERROR);
  }
});

// TODO 삭제
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

export const addDiaryNote = asyncWrapper(
  async (req: Request, res: Response) => {
    const centerId = req.loginUser?.centerId;
    const {
      activities,
      feedingTime,
      feedingAmt,
      napStart,
      napEnd,
      note,
      dogId,
    } = req.body;

    if (!centerId) {
      throw new CustomError(ErrorCode.USER_CENTER_ID_MISSING);
    }
    if (!dogId) {
      throw new CustomError(ErrorCode.DOG_QUERY_MISSING);
    }
    try {
      // DiaryNote 생성
      const newDiaryNote = await prisma.diaryNote.create({
        data: {
          activities,
          feedingTime,
          feedingAmt,
          napStart: napStart ? new Date(napStart) : null,
          napEnd: napEnd ? new Date(napEnd) : null,
          note,
          dog: { connect: { id: dogId } },
          center: { connect: { id: centerId } },
        },
      });

      successResponse(res, { newDiaryNote }, "DiaryNote created successfully");
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        logError(`Prisma error creating DiaryNote: ${error.message}`);
      } else {
        logError(`Error creating DiaryNote: ${error}`);
      }
      throw new CustomError(ErrorCode.PRISMA_INTERNAL_SERVER_ERROR);
    }
  }
);
