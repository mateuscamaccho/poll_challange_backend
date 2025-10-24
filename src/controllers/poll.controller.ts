import express from "express";
class PollController {

    constructor() {}

    public async helloWorld(req: express.Request, res: express.Response) {
        return res.status(200).json("Hello World!")
    } 
}

export = PollController;