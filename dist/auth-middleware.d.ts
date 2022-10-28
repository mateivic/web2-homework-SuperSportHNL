import { Request, Response, NextFunction } from 'express';
declare function requiresAdmin(req: Request, res: Response, next: NextFunction): void;
export { requiresAdmin };
