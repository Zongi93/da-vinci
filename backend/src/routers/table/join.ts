import { Request, Response } from 'express';
import { User } from '../../models';
import { tableManagerService } from '../../services';
export function joinTable(req: Request, res: Response) {
  const user = (req as any)['USER'] as User;
  const token = req.body.token;
  console.log(`${user.userName} requested to join table ${token}`);
  tableManagerService.joinTable(user, token);

  res.status(200).json(undefined);
}
