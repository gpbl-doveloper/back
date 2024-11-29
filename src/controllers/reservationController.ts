import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { asyncWrapper } from "../middlewares/async";
import { successResponse } from "../common/response";
import { CustomError } from "../lib/error/customError";
import ErrorCode from "../lib/error/errorCode";

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

export const getOwnerReservations = asyncWrapper(
  async (req: Request, res: Response) => {
    const ownerId = req.loginUser?.id;

    // TODO: user role validation
    if (!ownerId) {
      throw Error("Owner ID is required");
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        dog: {
          ownerId,
        },
      },
    });

    successResponse(
      res,
      { reservations },
      "Reservations retrieved successfully"
    );
  }
);

export const getCenterReservations = asyncWrapper(
  async (req: Request, res: Response) => {
    const centerId = req.loginUser?.centerId;

    // TODO: user role validation
    if (!centerId) {
      throw new Error("Center ID is required");
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        centerId,
      },
    });

    successResponse(
      res,
      { reservations },
      "Reservation requests retrieved successfully"
    );
  }
);

export const acceptReservation = asyncWrapper(
  async (req: Request, res: Response) => {
    const reservationId = Number(req.params.id);

    const reservation = await prisma.reservation.findUniqueOrThrow({
      where: { id: reservationId },
    });

    if (reservation.status !== "PENDDING") {
      throw new Error("Reservation already processed");
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: { status: "ACCEPTED" },
    });

    successResponse(
      res,
      { reservation: updatedReservation },
      "Reservation accepted successfully"
    );
  }
);

export const declineReservation = asyncWrapper(
  async (req: Request, res: Response) => {
    const reservationId = Number(req.params.id);

    const reservation = await prisma.reservation.findUniqueOrThrow({
      where: { id: reservationId },
    });

    if (reservation.status !== "PENDDING") {
      throw Error("Reservation already processed");
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: { status: "DECLINED" },
    });

    successResponse(
      res,
      { reservation: updatedReservation },
      "Reservation declined successfully"
    );
  }
);
