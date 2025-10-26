import { z } from 'zod';

export const createPollSchema = z.object({
    question: z.string().min(5).max(2000),
    start_date: z.iso.datetime(),
    end_date: z.iso.datetime(),
    options: z.array(z.object({
        text: z.string().min(5).max(700)
    })).min(3)
}).refine((data) => {
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);

    return end > start;
}, {
    message: "End date must be after start date",
    path: ["end_date"]
}).refine((data) => {
    const now = new Date();
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);

    return start > now && end > now;
}, {
    message: "Start and end date must be after today",
    path: ["end_date"]
})

export const listPollByIdSchema = z.object({
    id: z.string().uuid()
})

export const listPollByStatusSchema = z.object({
    status: z.enum(['inactive', 'active', 'running', 'closed'])
})

// Schema for partial updates to a poll. All fields optional but when dates are
// provided they're validated relative to each other.
export const updatePollSchema = z.object({
    question: z.string().min(5).max(2000).optional(),
    status: z.enum(['inactive', 'active', 'running', 'closed']).optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    options: z.array(z.object({
        text: z.string().min(1).max(700)
    })).optional()
}).refine((data) => {
    // if both dates provided ensure end > start
    if (data.start_date && data.end_date) {
        const start = new Date(data.start_date);
        const end = new Date(data.end_date);
        return end > start;
    }
    return true;
}, {
    message: "End date must be after start date",
    path: ["end_date"]
}).refine((data) => {
    // if provided, ensure dates are in the future (optional rule)
    const now = new Date();
    if (data.start_date) {
        const start = new Date(data.start_date);
        if (start <= now) return false;
    }
    if (data.end_date) {
        const end = new Date(data.end_date);
        if (end <= now) return false;
    }
    return true;
}, {
    message: "Start and end date must be after today",
    path: ["end_date"]
})