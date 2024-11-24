import express from "express";
import {
  createCenter,
  getCenterById,
  updateCenter,
  deleteCenter,
  searchCenters,
} from "../controllers/centerController";
import paths from "../common/paths";
import auth from "../middlewares/auth";
import loginUser from "../middlewares/loginUser";

const router = express.Router();

/**
 * @swagger
 * /api/center/add:
 *   post:
 *     summary: Create a new center
 *     description: Adds a new center with the provided details.
 *     tags:
 *       - Center
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the center
 *                 example: Happy Paws Daycare
 *               phone:
 *                 type: string
 *                 description: Phone number of the center
 *                 example: 123-456-7890
 *               description:
 *                 type: string
 *                 description: Description of the center
 *                 example: A safe and loving place for your pets.
 *               address:
 *                 type: string
 *                 description: Address of the center
 *                 example: 1234 Pet Street, Petville, CA 12345
 *     responses:
 *       200:
 *         description: Center created successfully
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
 *                   example: Center created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     center:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 3
 *                         name:
 *                           type: string
 *                           example: Happy Paws Daycare
 *                         phone:
 *                           type: string
 *                           example: 123-456-7890
 *                         description:
 *                           type: string
 *                           example: A safe and loving place for your pets.
 *                         address:
 *                           type: string
 *                           example: 1234 Pet Street, Petville, CA 12345
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-11-21T08:36:55.936Z
 *       400:
 *         description: Bad request - missing or invalid data
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
 *                   example: Missing required fields
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
// Create a new center
router.post(paths.center.add, auth, loginUser, createCenter);

/**
 * @swagger
 * /api/center/info/{id}:
 *   get:
 *     summary: Retrieve a specific center by ID
 *     description: Fetches the details of a specific center by its ID, including its associated files.
 *     tags:
 *       - Center
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the center to retrieve
 *     responses:
 *       200:
 *         description: Center retrieved successfully
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
 *                   example: Center retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     center:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: Happy Paws Daycare
 *                         phone:
 *                           type: string
 *                           example: 123-456-7890
 *                         description:
 *                           type: string
 *                           example: A safe and loving place for your pets.
 *                         address:
 *                           type: string
 *                           example: 1234 Pet Street, Petville, CA 12345
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-11-20T08:00:00.000Z
 *                         userId:
 *                           type: integer
 *                           example: 1
 *                         files:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 10
 *                               fileKey:
 *                                 type: string
 *                                 example: center/1/welcome.jpg
 *                               fileURL:
 *                                 type: string
 *                                 example: https://example-bucket.s3.us-west-1.amazonaws.com/center/1/welcome.jpg
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                                 example: 2024-11-20T08:30:00.000Z
 *       404:
 *         description: Center not found
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
 *                   example: Center not found
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
// Get a specific center by ID
router.get(paths.center.info, auth, loginUser, getCenterById);

/**
 * @swagger
 * /api/center/update/{id}:
 *   put:
 *     summary: Update a specific center
 *     description: Updates the details of a specific center by its ID. Only the fields provided in the request body will be updated.
 *     tags:
 *       - Center
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the center to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the center
 *                 example: Happy Tails Pet Care
 *               phone:
 *                 type: string
 *                 description: Phone number of the center
 *                 example: 987-654-32100
 *               description:
 *                 type: string
 *                 description: Description of the center
 *                 example: Your pet's home away from home.
 *               address:
 *                 type: string
 *                 description: Address of the center
 *                 example: 1234 Pet Street, Petville, CA 12345
 *     responses:
 *       200:
 *         description: Center updated successfully
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
 *                   example: Center updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     center:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 2
 *                         name:
 *                           type: string
 *                           example: Happy Tails Pet Care
 *                         phone:
 *                           type: string
 *                           example: 987-654-32100
 *                         description:
 *                           type: string
 *                           example: Your pet's home away from home.
 *                         address:
 *                           type: string
 *                           example: 1234 Pet Street, Petville, CA 12345
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-11-21T08:30:09.285Z
 *                         files:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 10
 *                               fileKey:
 *                                 type: string
 *                                 example: center/2/welcome.jpg
 *                               fileURL:
 *                                 type: string
 *                                 example: https://example-bucket.s3.us-west-1.amazonaws.com/center/2/welcome.jpg
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                                 example: 2024-11-21T08:36:55.936Z
 *       400:
 *         description: Invalid request - no valid fields provided for update
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
 *                   example: No valid fields provided for update
 *       404:
 *         description: Center not found
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
 *                   example: Center not found
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
// Update a specific center by ID
router.put(paths.center.update, auth, loginUser, updateCenter);

/**
 * @swagger
 * /api/center/delete/{id}:
 *   delete:
 *     summary: Delete a specific center
 *     description: Deletes a specific center by its ID.
 *     tags:
 *       - Center
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the center to delete
 *     responses:
 *       200:
 *         description: Center deleted successfully
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
 *                   example: Center deleted successfully
 *                 data:
 *                   type: null
 *                   example: null
 *       404:
 *         description: Center not found
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
 *                   example: Center not found
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
// Delete a specific center by ID
router.delete(paths.center.delete, auth, loginUser, deleteCenter);

/**
 * @swagger
 * /api/center/search:
 *   get:
 *     summary: Search for centers by name
 *     description: Retrieve a list of centers whose names partially match the search query.
 *     tags:
 *       - Center
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The partial or full name of the center to search for
 *     responses:
 *       200:
 *         description: Centers retrieved successfully
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
 *                   example: Centers retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     centers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: Happy Paws Daycare
 *                           phone:
 *                             type: string
 *                             example: 123-456-7890
 *                           description:
 *                             type: string
 *                             example: A safe and loving place for your pets.
 *                           address:
 *                             type: string
 *                             example: 1234 Pet Street, Petville, CA 12345
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2024-11-20T08:00:00.000Z

 *       400:
 *         description: Bad request - missing or invalid query parameter
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
 *                   example: Query parameter 'name' is required and must be a string
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
router.get(paths.center.search, auth, loginUser, searchCenters);

export default router;
