import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

type ValidationTarget = 'body' | 'query' | 'params';

export const validate = (
    schema: ZodObject,
    target: ValidationTarget = 'body'
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validated = await schema.parseAsync(req[target]);
            req[target] = validated; // Substitui com dados validados
            next();
            
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    error: "Validation failed",
                    details: error.issues.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                });
            }
            
            next(error);
        }
    };
};