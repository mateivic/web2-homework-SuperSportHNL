import { Express, Request, Response, NextFunction } from 'express'
import * as dotenv from "dotenv";

dotenv.config();

function requiresAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.oidc.isAuthenticated() && req.oidc.user && req.oidc.user?.email === process.env.ADMIN) {
    next();
  } else {
    res.redirect(302, "/login");
  }
}

export { requiresAdmin }