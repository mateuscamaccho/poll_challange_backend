import { jest } from '@jest/globals';

// Mock prisma client used by the controller
const mockPoll = {
	id: '11111111-1111-1111-1111-111111111111',
	question: 'Test poll',
	status: 'inactive',
	start_date: new Date().toISOString(),
	end_date: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
	PollOptions: []
};

const mockPrisma: any = {
	poll: {
		findMany: jest.fn(),
		findFirst: jest.fn(),
		findUnique: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn()
	}
};

jest.mock('../lib/prisma', () => ({ prisma: mockPrisma }));

const PollController = require('../controllers/poll.controller');

function mockResponse() {
	const res: any = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
}

describe('PollController', () => {
	let controller: any;

	beforeEach(() => {
		controller = new PollController();
		// clear mock calls
		Object.values(mockPrisma.poll).forEach((fn: any) => fn.mockClear());
	});

	describe('listAll', () => {
		it('should return list of polls', async () => {
			mockPrisma.poll.findMany.mockResolvedValue([mockPoll]);

			const req: any = {};
			const res = mockResponse();

			await controller.listAll(req, res);

			expect(mockPrisma.poll.findMany).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ success: true, data: [mockPoll] });
		});
	});

	describe('list', () => {
		it('should return a single poll by id', async () => {
			mockPrisma.poll.findFirst.mockResolvedValue(mockPoll);

			const req: any = { params: { id: mockPoll.id } };
			const res = mockResponse();

			await controller.list(req, res);

			expect(mockPrisma.poll.findFirst).toHaveBeenCalledWith({ where: { id: mockPoll.id }, include: { PollOptions: true } });
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ success: true, data: mockPoll });
		});
	});

	describe('listByStatus', () => {
		it('should return polls filtered by status', async () => {
			mockPrisma.poll.findMany.mockResolvedValue([mockPoll]);

			const req: any = { params: { status: 'inactive' } };
			const res = mockResponse();

			await controller.listByStatus(req, res);

			expect(mockPrisma.poll.findMany).toHaveBeenCalledWith({ where: { status: 'inactive' }, include: { PollOptions: true } });
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ success: true, data: [mockPoll] });
		});
	});

	describe('create', () => {
		it('should create a poll and return 201', async () => {
			const body = { question: 'Q', start_date: new Date().toISOString(), end_date: new Date(Date.now() + 1000).toISOString(), options: [{ text: 'a' }, { text: 'b' }, { text: 'c' }] };
			mockPrisma.poll.create.mockResolvedValue({ ...mockPoll, ...body });

			const req: any = { body };
			const res = mockResponse();

			await controller.create(req, res);

			expect(mockPrisma.poll.create).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalled();
		});
	});

	describe('update', () => {
		it('should return 404 if poll not found', async () => {
			mockPrisma.poll.findUnique.mockResolvedValue(null);

			const req: any = { params: { id: 'no-exists' }, body: {} };
			const res = mockResponse();

			await controller.update(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
		});

		it('should reject update when poll status is not inactive', async () => {
			mockPrisma.poll.findUnique.mockResolvedValue({ ...mockPoll, status: 'active' });

			const req: any = { params: { id: mockPoll.id }, body: { question: 'new' } };
			const res = mockResponse();

			await controller.update(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
		});

		it('should update poll when inactive', async () => {
			mockPrisma.poll.findUnique.mockResolvedValue({ ...mockPoll, status: 'inactive' });
			mockPrisma.poll.update.mockResolvedValue({ ...mockPoll, question: 'updated' });

			const req: any = { params: { id: mockPoll.id }, body: { question: 'updated' } };
			const res = mockResponse();

			await controller.update(req, res);

			expect(mockPrisma.poll.update).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ success: true, data: { ...mockPoll, question: 'updated' } });
		});
	});

	describe('delete', () => {
		it('should return 404 if poll not found', async () => {
			mockPrisma.poll.findUnique.mockResolvedValue(null);

			const req: any = { params: { id: 'no-exists' } };
			const res = mockResponse();

			await controller.delete(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
		});

		it('should return 400 if poll is closed', async () => {
			mockPrisma.poll.findUnique.mockResolvedValue({ ...mockPoll, status: 'closed' });

			const req: any = { params: { id: mockPoll.id } };
			const res = mockResponse();

			await controller.delete(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
		});

		it('should delete poll when not closed', async () => {
			mockPrisma.poll.findUnique.mockResolvedValue({ ...mockPoll, status: 'inactive' });
			mockPrisma.poll.delete.mockResolvedValue({});

			const req: any = { params: { id: mockPoll.id } };
			const res = mockResponse();

			await controller.delete(req, res);

			expect(mockPrisma.poll.delete).toHaveBeenCalledWith({ where: { id: mockPoll.id } });
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Poll deleted successfully' });
		});
	});
});

