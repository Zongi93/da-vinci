import { Request, Response } from 'express';
import { User } from '../../models';
import { userManagerService } from '../../services';

export function logoutUser(req: Request, res: Response) {
  const userId = req.cookies['SESSIONID'];
  userManagerService.logout(Number(userId));
  res.clearCookie('SESSIONID');
  res.status(200).json(undefined);
}
