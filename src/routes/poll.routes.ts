import express from "express";
import PollController from "../controllers/poll.controller";

const router = express.Router();

const pollController = new PollController()
/**
 * @swagger
 * /api/poll:
 *   get:
 *     summary: Returns all polls
 *     tags:
 *      - Poll Controller
 *     responses:
 *       200:
 *         description: Polls list
 */
router.get("/", pollController.helloWorld);

export = router;
