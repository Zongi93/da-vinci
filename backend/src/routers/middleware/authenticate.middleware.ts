import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import { userManagerService } from '../../services';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const userId = req.cookies['SESSIONID'];
  const user = userManagerService.findUserById(Number(userId));

  if (!!user) {
    (req as any)['USER'] = user;
    next();
  } else {
    res.sendStatus(403);
  }
}
