import { mock, MockProxy } from 'jest-mock-extended';
import express, { Response, Request } from 'express';
import PollController = require('../controllers/poll.controller');

describe('PollController', () => {
  let pollController: PollController;
  let req: MockProxy<Request>;
  let res: MockProxy<Response>;

  beforeEach(() => {
    pollController = new PollController();
    req = mock<Request>();
    res = mock<Response>();

    // Encadeamento de status e json
    res.status.mockReturnValue(res);
    res.json.mockReturnValue(res);
  });

  it('helloWorld deve retornar status 200 e json "ok"', async () => {
    await pollController.helloWorld(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith('Hello World!');
  });
});
