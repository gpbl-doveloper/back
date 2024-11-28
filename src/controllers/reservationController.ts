import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { asyncWrapper } from "../middlewares/async";
import { successResponse } from "../common/response";

export const createReservation = asyncWrapper(
  async (req: Request, res: Response) => {
    const { dogId, centerId, date } = req.body;

    if (!dogId || !centerId || !date) {
      throw Error("dogId, centerId, and date are required");
    }

    await prisma.dog.findUniqueOrThrow({ where: { id: dogId } }).catch(() => {
      throw Error("No Such Dog");
    });

    await prisma.center
      .findUniqueOrThrow({ where: { id: centerId } })
      .catch(() => {
        throw Error("No Such Center");
      });

    // TODO: 해당 강아지가 이미 그 날짜에 예약 있으면 에러

    const reservation = await prisma.reservation.create({
      data: {
        dog: { connect: { id: dogId } },
        center: { connect: { id: centerId } },
        date: new Date(date),
      },
    });

    successResponse(res, { reservation }, "Reservation created successfully");
  }
);
