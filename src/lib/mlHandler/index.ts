import axios from "axios";
import prisma from "../../lib/prisma";

const getTodayDate = (): string => {
    const today = new Date();
    return today.toISOString().split("T")[0];
};

type FileType = {
    fileId: number;
    url: string;
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
    const files = await prisma.file.findMany({
        where: {
            createdAt: {
                gte: new Date(`${today}T00:00:00`),
                lte: new Date(`${today}T23:59:59`),
            },
            centerId,
        },
        select: {
            id: true,
            fileURL: true,
        },
    });

    console.log("fetchDailyPictures", files);

    return files.map((file: { id: number; fileURL: string }) => ({      
        fileId: file.id,
        url: file.fileURL,
    }));
};

const fetchDogsData = async (centerId: number): Promise<DogDataType[]> => {
    const today = getTodayDate();
    const reservations = await prisma.reservation.findMany({
        where: {
            date: {
                gte: new Date(`${today}T00:00:00`), 
                lte: new Date(`${today}T23:59:59`),
            },
            status: "ACCEPTED",
            centerId,
        },
        select: {
            dogId: true,
        },
    });

    const dogIds = reservations.map((reservation: { dogId: number }) => reservation.dogId);

    const dogsData: DogDataType[] = [];
    for (const dogId of dogIds) {
        const files = await prisma.file.findMany({
            where: {
                dogId: dogId
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

    console.log("fetchDogsData", dogsData);

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

export const mlProcessor =  async (centerId: number): Promise<void> => {
    console.log("mlProcessor started");
    const dailyPictures = await fetchDailyPictures(centerId);
    const dogsData = await fetchDogsData(centerId);
    await sendToFastAPI(dailyPictures, dogsData).then((res) => {
        console.log("Process Completed:", res);
    }).catch((err: any) => {
        console.error(err); 
    });
    console.log("mlProcessor ended");
};
