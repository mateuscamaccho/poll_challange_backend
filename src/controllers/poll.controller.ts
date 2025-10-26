import { prisma } from "../lib/prisma";
import express from "express";

class PollController {

    constructor() { }

    public async listAll(req: express.Request, res: express.Response){
        try {
            const poll = await prisma.poll.findMany({
                include: {
                    PollOptions: true
                }
            })

            return res.status(200).json({
                success: true,
                data: poll
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: "Failed to list polls",
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    public async list(req: express.Request, res: express.Response) {
        try {
            const { id } = req.params;

            const poll = await prisma.poll.findFirst({
                where: {
                    id: id!
                },
                include: {
                    PollOptions: true
                }
            })

            return res.status(200).json({
                success: true,
                data: poll
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: "Failed to list poll",
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    public async listByStatus(req: express.Request, res: express.Response) {
        try {
            const { status } = req.params;

            const polls = await prisma.poll.findMany({
                where: {
                    status: status as any
                },
                include: {
                    PollOptions: true
                }
            })

            return res.status(200).json({
                success: true,
                data: polls
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: "Failed to list polls by status",
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    public async create(req: express.Request, res: express.Response) {
        try {
            const { question, start_date, end_date, options } = req.body;

            const poll = await prisma.poll.create({
                data: {
                    question: question,
                    status: "inactive",
                    start_date: new Date(start_date),
                    end_date: new Date(end_date),
                    PollOptions: {
                        create: options.map((opt: { text: string }) => ({
                            text: opt.text,
                            votes: 0
                        }))
                    }
                },
                include: {
                    PollOptions: true  // Retorna as opções junto com a poll
                }
            });

            return res.status(201).json({
                success: true,
                data: poll
            });

        } catch (error) {
            console.error('Error creating poll:', error);
            return res.status(500).json({
                success: false,
                error: "Failed to create poll",
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    public async update(req: express.Request, res: express.Response) {
        try {
            const { id } = req.params;
            const { question, start_date, end_date, options, status } = req.body;

            const existing = await prisma.poll.findUnique({
                where: { id: id! }
            });

            if (!existing) {
                return res.status(404).json({
                    success: false,
                    error: 'Poll not found'
                });
            }

            if (existing.status !== 'inactive') {
                return res.status(400).json({
                    success: false,
                    error: 'Only polls in inactive status can be edited'
                });
            }

            const data: any = {};
            if (question !== undefined) data.question = question;
            if (status !== undefined) data.status = status;
            if (start_date !== undefined) data.start_date = new Date(start_date);
            if (end_date !== undefined) data.end_date = new Date(end_date);

            // If options provided, replace existing options with the new set
            if (options !== undefined) {
                data.PollOptions = {
                    deleteMany: {},
                    create: options.map((opt: { text: string }) => ({
                        text: opt.text,
                        votes: 0
                    }))
                }
            }

            const updated = await prisma.poll.update({
                where: { id: id! },
                data,
                include: { PollOptions: true }
            });

            return res.status(200).json({
                success: true,
                data: updated
            })
        } catch (error) {
            console.error('Error updating poll:', error);
            return res.status(500).json({
                success: false,
                error: "Failed to update poll",
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    public async delete(req: express.Request, res: express.Response) {
        try {
            const { id } = req.params;

            const existing = await prisma.poll.findUnique({
                where: { id: id! }
            });

            if (!existing) {
                return res.status(404).json({
                    success: false,
                    error: 'Poll not found'
                });
            }

            if (existing.status === 'closed') {
                return res.status(400).json({
                    success: false,
                    error: 'Closed polls cannot be deleted'
                });
            }

            // Delete the poll (and related options if cascade is configured)
            await prisma.poll.delete({
                where: { id: id! }
            });

            return res.status(200).json({
                success: true,
                message: 'Poll deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting poll:', error);
            return res.status(500).json({
                success: false,
                error: "Failed to delete poll",
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}

export = PollController;