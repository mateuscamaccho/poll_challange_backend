import express from "express";
import { api_port } from "../server";

const router = express.Router();

const default_response = {
  status: 200,
  message: "Welcome to Polls Api, it's working!",
  version: "1.0.0",
  documentation: process.env.ENVIRONMENT === "dev" ? `http://localhost:${api_port}/docs` : "/docs"
}

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root health check
 *     description: Returns a simple status message and documentation link
 *     tags:
 *       - Default
 *     responses:
 *       200:
 *         description: API is working
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Welcome to Polls Api, it's working!"
 */
router.get("/", async (req: express.Request, res: express.Response) => {
    return res.status(200).json(default_response);
});

/**
 * @swagger
 * /api:
 *   get:
 *     summary: API base route
 *     description: Alias to root (mounted under /api)
 *     tags:
 *       - Default
 *     responses:
 *       200:
 *         description: API base info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get("/", async (req: express.Request, res: express.Response) => {
    return res.status(200).json(default_response);
});

export = router;
