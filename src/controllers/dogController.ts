import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { asyncWrapper } from "../middlewares/async";
import { successResponse } from "../common/response";
import { CustomError } from "../lib/error/customError";
import ErrorCode from "../lib/error/errorCode";
import { DiaryNote, DiaryPhoto, Dog, File } from "@prisma/client";
import { storageService } from "../lib/storage";
import { promises as fs } from "fs";
import { logError } from "../middlewares/logger";

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
  const { name, sex, isNeutered, bod, breed } = req.body;
  const files = req.files as Express.Multer.File[];

  const createdDog = await prisma.dog.create({
    data: {
      name,
      sex,
      isNeutered: Boolean(isNeutered),
      bod: new Date((bod as string) || 0),
      breed,
      owner: { connect: { id: req.loginUser?.id } },
    },
  });

  if (!files || files.length === 0) {
    throw new CustomError(ErrorCode.NO_FILES_UPLOADED);
  }

  const uploadedFiles: File[] = [];
  try {
    for (const file of files) {
      const filePath = file.path;
      const destination = `dogs/${createdDog.id}/${file.filename}`;
      const location = await storageService.uploadFile(filePath, destination);

      const createdFile = await prisma.file.create({
        data: {
          fileKey: destination,
          fileURL: location,
          dog: { connect: { id: createdDog.id } },
        },
      });
      uploadedFiles.push(createdFile);

      await fs.unlink(filePath); // async unlinking
    }
  } catch (error: any) {
    // Cleanup on failure
    logError(`Error during file upload: ${error.message}`);
    try {
      for (const file of uploadedFiles) {
        await storageService.deleteFile(file.fileKey);
      }
    } catch (cleanupError) {
      logError(`File cleanup failed: ${cleanupError}`);
    }
    throw error;
  }

  if (uploadedFiles.length === 0) {
    throw new Error("No files were successfully uploaded.");
  }

  const result = await prisma.dog.update({
    where: {
      id: createdDog.id,
    },
    data: {
      img: uploadedFiles[0].fileURL,
    },
    include: { facefiles: true },
  });

  successResponse(res, { dog: result }, "Dog created successfully");
});

// Update a specific dog by ID
export const updateDog = asyncWrapper(async (req: Request, res: Response) => {
  const dogId = Number(req.params.id);
  const { name, sex, isNeutered, bod, breed, medication } = req.body;

  await prisma.dog
    .findUniqueOrThrow({ where: { id: dogId, ownerId: req.loginUser?.id } })
    .catch(() => {
      throw new CustomError(ErrorCode.DOG_NOT_FOUND);
    });

  // Dynamically add only the data to be updated
  const updateData: Record<string, any> = {};

  if (name !== undefined && name !== null) updateData.name = name;
  if (sex !== undefined && sex !== null) updateData.sex = sex;
  if (isNeutered !== undefined && isNeutered !== null)
    updateData.isNeutered = Boolean(isNeutered);
  if (bod !== undefined && bod !== null) updateData.bod = new Date(bod);
  if (breed !== undefined && breed !== null) updateData.breed = breed;
  if (medication !== undefined && medication !== null)
    updateData.medication = medication;

  if (Object.keys(updateData).length === 0) {
    throw new Error("No valid fields provided for update");
  }

  const updatedDog = await prisma.dog.update({
    where: { id: dogId },
    data: updateData,
  });

  successResponse(res, { dog: updatedDog }, "Dog updated successfully");
});

// Delete a specific dog by ID
export const deleteDog = asyncWrapper(async (req: Request, res: Response) => {
  const dogId = Number(req.params.id);

  await prisma.dog
    .findUniqueOrThrow({ where: { id: dogId, ownerId: req.loginUser?.id } })
    .catch(() => {
      throw new CustomError(ErrorCode.DOG_NOT_FOUND);
    });

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
          orderBy: { createdAt: "desc" },
        });
        type DiaryPhotoWithPictures = DiaryPhoto & { pictures: File[] };
        const diaryPhoto: DiaryPhotoWithPictures =
          await prisma.diaryPhoto.findFirst({
            where: { dogId: dog.id, createdAt: { gte: today } },
            include: {
              pictures: true, // File[] 배열 포함
            },
            orderBy: { createdAt: "desc" },
          });

        // getStatus 함수를 사용해 각 상태를 계산
        const diaryNoteStatus = getStatus(diaryNote);
        const diaryPhotoStatus = getStatus(diaryPhoto);

        return {
          ...dog,
          diaryNoteStatus,
          diaryPhotoStatus,
          diaryNoteId: diaryNote?.id,
          diaryPhotoId: diaryPhoto?.id,
          photoLength: diaryPhoto?.pictures.length,
        };
      })
    );

    successResponse(res, { dogsWithStatus }, "Dogs retrieved successfully");
  }
);
