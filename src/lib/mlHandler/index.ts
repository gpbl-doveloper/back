import axios from "axios";
import prisma from "../../lib/prisma";
import { logError, logInfo } from "../../middlewares/logger";

const getTodayDate = (): string => {
  const today = new Date();
  //   console.log("today", today);
  return today.toISOString().split("T")[0];
};

type FileType = {
  fileId: number;
  url: string;
};

type ReservationType = {
  dogId: number;
};

type DogDataType = {
  dogId: number;
  faces: FileType[];
};

type FastAPIResponse = {
  status: string;
  results: {
    dogId: number;
    imageFiles: FileType[];
  }[];
};

const fetchDailyPictures = async (centerId: number): Promise<FileType[]> => {
  const today = getTodayDate();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0); // set time to midnight
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999); // set time to 23:59:59

  const files = await prisma.file.findMany({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
      centerId,
    },
    select: {
      id: true,
      fileURL: true,
    },
  });

  //   console.log("fetchDailyPictures", files);

  return files.map((file: { id: number; fileURL: string }) => ({
    fileId: file.id,
    url: file.fileURL,
  }));
};

const fetchReservations = async (
  centerId: number
): Promise<ReservationType[]> => {
  const today = getTodayDate();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0); // set time to midnight
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999); // set time to 23:59:59

  const reservations = await prisma.reservation.findMany({
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
      centerId,
    },
    select: {
      dogId: true,
    },
  });

  return reservations;
};

const fetchDogsData = async (
  reservations: ReservationType[]
): Promise<DogDataType[]> => {
  const dogIds = reservations.map(
    (reservation: { dogId: number }) => reservation.dogId
  );

  const dogsData: DogDataType[] = [];
  for (const dogId of dogIds) {
    const files = await prisma.file.findMany({
      where: {
        dogId: dogId,
      },
      select: {
        id: true,
        fileURL: true,
      },
    });

    dogsData.push({
      dogId: dogId,
      faces: files.map((file: { id: number; fileURL: string }) => ({
        fileId: file.id,
        url: file.fileURL,
      })),
    });
  }

  //   console.log("fetchDogsData", JSON.stringify(dogsData));
  return dogsData;
};

const sendToFastAPI = async (
  dailyPictures: FileType[],
  dogsData: DogDataType[]
) => {
  const apiUrl = `${process.env.ML_API_URL}/face/`;
  const requestData = {
    dailyPictures,
    dogsData,
  };

  return axios.post<FastAPIResponse>(apiUrl, requestData);
};

const createDiaryPhoto = async (
  centerId: number,
  dogId: number,
  files: FileType[]
): Promise<void> => {
  await prisma.diaryPhoto.create({
    data: {
      center: {
        connect: {
          id: centerId,
        },
      },
      dog: {
        connect: {
          id: dogId,
        },
      },
      pictures: {
        connect: files.map((file: FileType) => ({
          id: file.fileId,
        })),
      },
    },
  });
};

export const mlProcessor = async (centerId: number): Promise<void> => {
  logInfo("mlProcessor started");
  const dailyPictures = await fetchDailyPictures(centerId);
  const reservations = await fetchReservations(centerId);
  const dogsData = await fetchDogsData(reservations);
  const results = await sendToFastAPI(dailyPictures, dogsData)
    .then((res) => {
      logInfo("Process Completed: " + JSON.stringify(res.data, null, 2));
      return res.data.results;
    })
    .catch((err: any) => {
      logError(err);
    });

  // create DiaryPhoto on every dogId
  if (results) {
    for (const result of results) {
      await createDiaryPhoto(centerId, result.dogId, result.imageFiles);
    }
  }

  logInfo("mlProcessor ended");
};
