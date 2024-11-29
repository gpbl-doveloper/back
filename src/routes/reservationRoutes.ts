import express from "express";
import {
  createReservation,
  getOwnerReservations,
  getCenterReservations,
  acceptReservation,
  declineReservation,
} from "../controllers/reservationController";
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
 *       - Reservation
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

/**
 * @swagger
 * /api/reservation/owner/all:
 *   get:
 *     summary: Get all reservations for the logged-in owner
 *     description: Retrieves a list of all reservations made by the logged-in dog owner.
 *     tags:
 *       - Reservation
 *     security:
 *       - bearerAuth: [] # Requires authentication token
 *     responses:
 *       200:
 *         description: Reservations retrieved successfully
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
 *                   example: Reservations retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     reservations:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           dogId:
 *                             type: integer
 *                             example: 1
 *                           centerId:
 *                             type: integer
 *                             example: 1
 *                           date:
 *                             type: string
 *                             format: date-time
 *                             example: 2024-12-01T10:00:00.000Z
 *                           status:
 *                             type: string
 *                             example: PENDDING
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2024-11-24T09:50:01.407Z
 *       401:
 *         description: Unauthorized - The user is not logged in
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
 *                   example: Unauthorized - Please log in
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
// Get all reservations for the logged-in owner
router.get(paths.reservation.ownerAll, auth, loginUser, getOwnerReservations);

/**
 * @swagger
 * /api/reservation/center/all:
 *   get:
 *     summary: Get all reservation requests for the logged-in center
 *     description: Retrieves a list of all reservation requests made for the logged-in center.
 *     tags:
 *       - Reservation
 *     security:
 *       - bearerAuth: [] # Requires authentication token
 *     responses:
 *       200:
 *         description: Reservation requests retrieved successfully
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
 *                   example: Reservation requests retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     reservations:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           dogId:
 *                             type: integer
 *                             example: 1
 *                           centerId:
 *                             type: integer
 *                             example: 2
 *                           date:
 *                             type: string
 *                             format: date-time
 *                             example: 2024-12-01T10:00:00.000Z
 *                           status:
 *                             type: string
 *                             example: PENDDING
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2024-11-24T09:50:01.407Z
 *       401:
 *         description: Unauthorized - The user is not logged in or not a center user
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
 *                   example: Unauthorized - Please log in as a center user
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
// Get all reservations for the logged-in center
router.get(paths.reservation.centerAll, auth, loginUser, getCenterReservations);

/**
 * @swagger
 * /api/reservation/accept/{id}:
 *   put:
 *     summary: Accept a reservation
 *     description: Updates the status of a reservation to "ACCEPTED" for the specified reservation ID.
 *     tags:
 *       - Reservation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the reservation to accept
 *     security:
 *       - bearerAuth: [] # Requires authentication token
 *     responses:
 *       200:
 *         description: Reservation accepted successfully
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
 *                   example: Reservation accepted successfully
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
 *                           example: 2
 *                         date:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-12-01T10:00:00.000Z
 *                         status:
 *                           type: string
 *                           example: ACCEPTED
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-11-24T09:50:01.407Z
 *       400:
 *         description: Bad request - The reservation is already processed
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
 *                   example: Reservation already processed
 *       404:
 *         description: Not found - The reservation ID does not exist
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
 *                   example: Reservation not found
 *       401:
 *         description: Unauthorized - User is not logged in or not authorized
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
 *                   example: Unauthorized - Please log in
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
// Accept a reservation by ID
router.put(paths.reservation.accept, auth, loginUser, acceptReservation);

/**
 * @swagger
 * /api/reservation/decline/{id}:
 *   put:
 *     summary: Decline a reservation
 *     description: Updates the status of a reservation to "DECLINED" for the specified reservation ID.
 *     tags:
 *       - Reservation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the reservation to decline
 *     security:
 *       - bearerAuth: [] # Requires authentication token
 *     responses:
 *       200:
 *         description: Reservation declined successfully
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
 *                   example: Reservation declined successfully
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
 *                           example: 2
 *                         date:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-12-01T10:00:00.000Z
 *                         status:
 *                           type: string
 *                           example: DECLINED
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-11-24T09:50:01.407Z
 *       400:
 *         description: Bad request - The reservation is already processed
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
 *                   example: Reservation already processed
 *       404:
 *         description: Not found - The reservation ID does not exist
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
 *                   example: Reservation not found
 *       401:
 *         description: Unauthorized - User is not logged in or not authorized
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
 *                   example: Unauthorized - Please log in
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
// Decline a reservation by ID
router.put(paths.reservation.decline, auth, loginUser, declineReservation);

export default router;
