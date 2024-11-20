import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { asyncWrapper } from "../middlewares/async";
import { successResponse } from "../common/response";
import { CustomError } from "../lib/error/customError";
import ErrorCode from "../lib/error/errorCode";
import { DiaryNote, DiaryPhoto, Dog } from "@prisma/client";

// Get a list of all dogs of owner
export const getDogs = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.loginUser?.id;

  if (req.loginUser?.role !== "PARENT")
    throw new CustomError(ErrorCode.NOT_A_PARENT);

  const dogs = await prisma.dog.findMany({
    where: { ownerId: userId },
  });
  successResponse(res, { dogs }, "Dogs retrieved successfully");
});

// Get a specific dog by ID
export const getDog = asyncWrapper(async (req: Request, res: Response) => {
  const dogId = Number(req.params.id);
  const dog = await prisma.dog.findUnique({ where: { id: dogId } });

  if (!dog) throw new CustomError(ErrorCode.DOG_NOT_FOUND);

  successResponse(res, { dog }, "Dog retrieved successfully");
});

// Create a new dog
export const createDog = asyncWrapper(async (req: Request, res: Response) => {
  // TODO 이미지 10장 올리고 한장은 프사
  const { name, sex, isNeutered, bod, breed } = req.body;

  const createdDog = await prisma.dog.create({
    data: {
      name,
      sex,
      isNeutered,
      bod: new Date(bod),
      breed,
      owner: { connect: { id: req.loginUser?.id } },
    },
  });

  successResponse(res, { dog: createdDog }, "Dog created successfully");
});

// TODO Update a specific dog by ID
export const updateDog = asyncWrapper(async (req: Request, res: Response) => {
  const dogId = Number(req.params.id);
  const { name, sex, isNeutered, bod, breed, medication } = req.body;

  const updatedDog = await prisma.dog.update({
    where: { id: dogId },
    data: { name, sex, isNeutered, bod: new Date(bod), breed, medication },
  });

  successResponse(res, { dog: updatedDog }, "Dog updated successfully");
});

// TODO Delete a specific dog by ID
export const deleteDog = asyncWrapper(async (req: Request, res: Response) => {
  const dogId = Number(req.params.id);

  await prisma.dog.delete({ where: { id: dogId } });

  successResponse(res, null, "Dog deleted successfully");
});

// 상태를 계산하는 함수
const getStatus = (entry: { sentAt?: Date | null } | null): number => {
  if (!entry) return 0; // "not started";
  return entry.sentAt ? 1 : 2; // "sent" : "draft";
};

// 당일 예약되어있는 강아지의 status 반환
export const reservationsToday = asyncWrapper(
  async (req: Request, res: Response) => {
    const name = String(req.query.name || "").trim();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // FIXME 당일 예약 기록에서 accepted 된 강아지 목록 가져오기
    const dogs: Dog[] = await prisma.dog.findMany({
      where: name ? { name: { contains: name } } : {},
    });

    const dogsWithStatus = await Promise.all(
      dogs.map(async (dog) => {
        const diaryNote: DiaryNote = await prisma.diaryNote.findFirst({
          where: { dogId: dog.id, createdAt: { gte: today } },
        });
        type DiaryPhotoWithPictures = DiaryPhoto & { pictures: File[] };
        const diaryPhoto: DiaryPhotoWithPictures =
          await prisma.diaryPhoto.findFirst({
            where: { dogId: dog.id, createdAt: { gte: today } },
            include: {
              pictures: true, // File[] 배열 포함
            },
          });

        // getStatus 함수를 사용해 각 상태를 계산
        const diaryNoteStatus = getStatus(diaryNote);
        const diaryPhotoStatus = getStatus(diaryPhoto);

        return {
          ...dog,
          diaryNoteStatus,
          diaryPhotoStatus,
          diaryNoteId: diaryNote?.id,
          photoLength: diaryPhoto?.pictures.length,
        };
      })
    );

    successResponse(res, { dogsWithStatus }, "Dogs retrieved successfully");
  }
);
