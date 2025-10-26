import express from "express";
import PollController from "../controllers/poll.controller";
import { createPollSchema, listPollByIdSchema, listPollByStatusSchema, updatePollSchema } from "../schemas/poll.schemas";
import { validate } from "../middlewares/validate.middleware";

const router = express.Router();

const pollController = new PollController()

/**
 * @swagger
 * /api/poll:
 *   get:
 *     summary: List all polls
 *     description: Returns a list of all polls with their options
 *     tags:
 *       - Poll Controller
 *     responses:
 *       200:
 *         description: A list of polls
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 */
router.get("/", pollController.listAll.bind(pollController));

/**
 * @swagger
 * /api/poll/{id}:
 *   get:
 *     summary: Get a poll by ID
 *     description: Returns a single poll with its options
 *     tags:
 *       - Poll Controller
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID of the poll to retrieve
 *     responses:
 *       200:
 *         description: Poll found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       404:
 *         description: Poll not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/poll/status/{status}:
 *   get:
 *     summary: List polls by status
 *     description: Returns polls filtered by status (inactive, active, running, closed)
 *     tags:
 *       - Poll Controller
 *     parameters:
 *       - in: path
 *         name: status
 *         schema:
 *           type: string
 *           enum: [inactive, active, running, closed]
 *         required: true
 *         description: Status to filter polls
 *     responses:
 *       200:
 *         description: A list of polls filtered by status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Bad request - Invalid status
 *       500:
 *         description: Internal server error
 */
router.get("/status/:status", validate(listPollByStatusSchema, 'params'), pollController.listByStatus.bind(pollController));

router.get("/:id", validate(listPollByIdSchema, 'params'), pollController.list.bind(pollController));

/**
 * @swagger
 * /api/poll:
 *   post:
 *     summary: Create a new poll
 *     description: Creates a new poll with question, dates and options
 *     tags:
 *       - Poll Controller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - start_date
 *               - end_date
 *               - options
 *             properties:
 *               question:
 *                 type: string
 *                 description: The poll question
 *                 example: "What is your favorite programming language?"
 *               status:
 *                 type: string
 *                 description: Poll status (optional)
 *                 enum: [active, inactive, draft]
 *                 default: draft
 *                 example: "active"
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 description: Poll start date
 *                 example: "2025-10-25T10:00:00Z"
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 description: Poll end date
 *                 example: "2025-11-25T10:00:00Z"
 *               options:
 *                 type: array
 *                 description: Poll options
 *                 minItems: 2
 *                 items:
 *                   type: object
 *                   required:
 *                     - text
 *                   properties:
 *                     text:
 *                       type: string
 *                       example: "JavaScript"
 *     responses:
 *       201:
 *         description: Poll created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 question:
 *                   type: string
 *                   example: "What is your favorite programming language?"
 *                 status:
 *                   type: string
 *                   example: "active"
 *       400:
 *         description: Bad request - Invalid input
 *       500:
 *         description: Internal server error
 */
router.post("/", validate(createPollSchema), pollController.create.bind(pollController));

/**
 * @swagger
 * /api/poll/{id}:
 *   put:
 *     summary: Update a poll (only when inactive)
 *     description: Update any poll fields (question, dates, status, options). Edits are only allowed while poll is in 'inactive' status. If options are provided they replace existing options and votes will reset.
 *     tags:
 *       - Poll Controller
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID of the poll to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [inactive, active, running, closed]
 *               start_date:
 *                 type: string
 *                 format: date-time
 *               end_date:
 *                 type: string
 *                 format: date-time
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *     responses:
 *       200:
 *         description: Poll updated
 *       400:
 *         description: Bad request or poll not editable
 *       404:
 *         description: Poll not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", validate(listPollByIdSchema, 'params'), validate(updatePollSchema), pollController.update.bind(pollController));

/**
 * @swagger
 * /api/poll/{id}:
 *   delete:
 *     summary: Delete a poll (not allowed if status is 'closed')
 *     description: Deletes a poll by id. Polls with status 'closed' cannot be deleted.
 *     tags:
 *       - Poll Controller
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID of the poll to delete
 *     responses:
 *       200:
 *         description: Poll deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Poll deleted successfully"
 *       400:
 *         description: Bad request - poll is closed and cannot be deleted
 *       404:
 *         description: Poll not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", validate(listPollByIdSchema, 'params'), pollController.delete.bind(pollController));

export = router;
