import prisma from "../prisma/index.js";
import axios from "axios";

// 날짜 유틸 함수: 오늘 날짜를 YYYY-MM-DD 형식으로 반환
const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
};

// dailyPictures 데이터를 추출하는 함수
const fetchDailyPictures = async () => {
    try {
        const today = getTodayDate();
        const files = await prisma.file.findMany({
            where: {
                createdAt: {
                    gte: new Date(`${today}T00:00:00`),
                    lt: new Date(`${today}T23:59:59`),
                },
            },
            select: {
                id: true,
                fileURL: true,
            },
        });

        return files.map(file => ({
            fileId: file.id,
            url: file.fileURL,
        }));
    } catch (error) {
        console.error("Error fetching dailyPictures:", error);
        throw error;
    }
};

// dogsData 데이터를 추출하는 함수
const fetchDogsData = async () => {
    try {
        const today = getTodayDate();

        // 오늘 예약된 dogId를 가져옴
        const reservations = await prisma.reservation.findMany({
            where: {
                createdAt: {
                    gte: new Date(`${today}T00:00:00`),
                    lt: new Date(`${today}T23:59:59`),
                },
            },
            select: {
                dogId: true,
            },
        });

        const dogIds = reservations.map(reservation => reservation.dogId);

        // 각 dogId에 연결된 파일을 가져옴
        const dogsData = [];
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
                faces: files.map(file => ({
                    fileId: file.id,
                    url: file.fileURL,
                })),
            });
        }

        return dogsData;
    } catch (error) {
        console.error("Error fetching dogsData:", error);
        throw error;
    }
};

// FastAPI 서버로 요청을 보내는 함수
const sendToFastAPI = async (dailyPictures, dogsData) => {
    const apiUrl = "http://44.203.88.250:8000/face/";
    const requestData = {
        dailyPictures,
        dogsData,
    };

    try {
        const response = await axios.post(apiUrl, requestData);
        console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending data to FastAPI:", error);
        throw error;
    }
};

// 전체 프로세스를 실행하는 함수 (함수 이름 변경)
const mlProcessor = async () => {
    try {
        const dailyPictures = await fetchDailyPictures();
        const dogsData = await fetchDogsData();
        console.log("Fetched Data:", { dailyPictures, dogsData });

        const response = await sendToFastAPI(dailyPictures, dogsData);
        console.log("Process Completed:", response);
    } catch (error) {
        console.error("Error in mlProcessor:", error);
    }
};

// 실행
mlProcessor();