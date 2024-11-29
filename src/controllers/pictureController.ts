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
  const centerId = req.loginUser?.centerId;
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    throw new CustomError(ErrorCode.NO_FILES_UPLOADED);
  }

  const uploadResults: File[] = [];

  // upload each file to storageService
  for (const file of files) {
    const filePath = file.path;
    const destination = `uploads/${centerId}/${Date.now()}/${file.filename}`;
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

  // TODO 오늘 예약 accepted 된 강아지마다 photo 생성

  successResponse(res, { files: uploadResults });
});

export const getFiles = asyncWrapper(async (req: Request, res: Response) => {
  const { date } = req.query;
  const dateMidnight = new Date(date ? (date as string) : Date()); // default: today
  dateMidnight.setHours(0, 0, 0, 0); // set time to midnight

  // TODO 센터에서 올린 사진만

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

// 강아지 얼굴 학습 및 식별 알고리즘과 인터렉션

const faceLearnerUrl = 'http://44.203.88.250:8000/faceLearner/'
const classifyImagesUrl = 'http://44.203.88.250:8000/classifyImages/'

// 오늘 예약한 강아지의 리스트를 가져오는 함수

async function getTodayReservedDogIds() {
  // 오늘의 날짜 범위 계산
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  try {
    // 예약이 오늘 날짜인 강아지 ID 추출
    const reservations = await prisma.reservation.findMany({
      where: {
        date: {
          gte: todayStart, // 오늘 00:00:00 이후
          lte: todayEnd,   // 오늘 23:59:59 이전
        },
      },
      select: {
        dogId: true, // 강아지 ID만 선택
      },
    });

    // 강아지 ID 배열 생성
    const dogIds = reservations.map((reservation: { dogId: number }) => reservation.dogId);
    console.log('Reserved dog IDs for today:', dogIds);

    return dogIds;
  } catch (error) {
    console.error('Error occurred during loading today dog list:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function sendDogDataToAPI() {
  try {
    // getTodayReservedDogIds 함수의 반환 타입을 명시적으로 number[]로 예상
    const dogIds: number[] = await getTodayReservedDogIds();

    if (!dogIds || dogIds.length === 0) {
      console.log('faceLearner - No dogs reserved for today.');
      return;
    }

    const dogsData = dogIds.map((dogId: number) => ({
      s3Link: `dovelopers-bucket/dogs/${dogId}/`,
      dogName: dogId.toString(),
    }));

    console.log('faceLearner - Data to be sent to API:', { dogsData });

    const response = await axios.post(faceLearnerUrl, { dogsData });
    console.log('faceLearner - API Response:', response.data);
    return response.data;
  } catch (error: unknown) {
    // 일반 Error 객체인지 확인
    if (error instanceof Error) {
      console.error('faceLearner - Error occurred:', error.message);
    } else {
      // 예상치 못한 에러 처리
      console.error('faceLearner - Unknown error occurred:', error);
    }
    throw error; // 에러를 다시 던짐
  }
}