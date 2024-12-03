import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
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

export const updateNote = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { activities, feedingTime, feedingAmt, napStart, napEnd, note } =
    req.body;

  const updateData: Record<string, any> = {};
  if (activities !== undefined && activities !== null)
    updateData.activities = activities;
  if (feedingTime !== undefined && feedingTime !== null)
    updateData.feedingTime = feedingTime;
  if (feedingAmt !== undefined && feedingAmt !== null)
    updateData.feedingAmt = feedingAmt;
  if (napStart !== undefined && napStart !== null)
    updateData.napStart = new Date(napStart);
  if (napEnd !== undefined && napEnd !== null)
    updateData.napEnd = new Date(napEnd);
  if (note !== undefined && note !== null) updateData.note = note;

  if (Object.keys(updateData).length === 0) {
    throw new CustomError(ErrorCode.NO_VALID_FIELDS_PROVIDED);
  }

  const updatedNote = await prisma.diaryNote
    .update({
      where: { id: Number(id) },
      data: updateData,
    })
    .catch((error: unknown) => {
      logError(`Error updating DiaryNote: ${error}`);
      throw new CustomError(ErrorCode.PRISMA_INTERNAL_SERVER_ERROR);
    });

  successResponse(res, { updatedNote }, "DiaryNote updated successfully");
});

export const sendNote = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;

  const sentNote = await prisma.diaryNote
    .update({
      where: { id: Number(id) },
      data: {
        sentAt: new Date(),
      },
    })
    .catch((error: unknown) => {
      logError(`Error sending DiaryNote: ${error}`);
      throw new CustomError(ErrorCode.PRISMA_INTERNAL_SERVER_ERROR);
    });

  // TODO 추후 notification 추가

  successResponse(res, { sentNote }, "DiaryNote sent successfully");
});

export const sendPhoto = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { pictureIds } = req.body;

  // validate pictureIds
  await prisma.file
    .findMany({
      where: { id: { in: pictureIds } },
    })
    .catch((error: unknown) => {
      logError(`Error fetching files: ${error}`);
      throw new CustomError(ErrorCode.PRISMA_INTERNAL_SERVER_ERROR);
    })
    .then((files: any) => {
      const fetchedIdList = files.map((file: any) => {
        return file.id;
      });

      if (fetchedIdList.length !== pictureIds.length) {
        throw new CustomError(ErrorCode.FILE_NOT_FOUND);
      }
    });

  const sentPhoto = await prisma.diaryPhoto
    .update({
      where: { id: Number(id) },
      data: {
        sentAt: new Date(),
        pictures: { connect: pictureIds.map((id: number) => ({ id })) },
      },
      include: {
        pictures: true,
      },
    })
    .catch((error: unknown) => {
      logError(`Error sending DiaryPhoto: ${error}`);
      throw new CustomError(ErrorCode.PRISMA_INTERNAL_SERVER_ERROR);
    });

  // TODO 추후 notification 추가

  successResponse(res, { sentPhoto }, "DiaryPhoto sent successfully");
});
