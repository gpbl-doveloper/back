import express from "express";
import { createReservation } from "../controllers/reservationController";
import paths from "../common/paths";
import auth from "../middlewares/auth";
import loginUser from "../middlewares/loginUser";

const router = express.Router();

/**
 * @swagger
 * /api/reservation/add:
 *   post:
 *     summary: Create a new reservation
 *     description: Creates a new reservation for a dog at a specific center on a given date.
 *     tags:
 *       - Reservations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dogId:
 *                 type: integer
 *                 description: ID of the dog for the reservation
 *                 example: 1
 *               centerId:
 *                 type: integer
 *                 description: ID of the center where the reservation is being made
 *                 example: 1
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Date and time of the reservation in ISO 8601 format
 *                 example: 2024-12-01T10:00:00.000Z
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Reservation created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     reservation:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         dogId:
 *                           type: integer
 *                           example: 1
 *                         centerId:
 *                           type: integer
 *                           example: 1
 *                         date:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-12-01T10:00:00.000Z
 *                         status:
 *                           type: string
 *                           example: PENDDING
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-11-24T09:50:01.407Z
 *       400:
 *         description: Bad request - missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid request body
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
// create a new reservation
router.post(paths.reservation.add, auth, loginUser, createReservation);

export default router;
