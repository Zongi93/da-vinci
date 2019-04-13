import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import { validateXsrfToken } from '../../utils/security';

export function checkCsrf(req: Request, res: Response, next: NextFunction) {
  const csrfCookie = req.cookies['XSRF-TOKEN'];
  const csrfHeader = req.headers['x-xsrf-token'];

  if (
    !!csrfCookie &&
    !!csrfHeader &&
    csrfCookie === csrfHeader &&
    validateXsrfToken(csrfCookie)
  ) {
    next();
  } else {
    res.sendStatus(403);
  }
}
