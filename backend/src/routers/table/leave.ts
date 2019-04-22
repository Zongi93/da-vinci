import { Request, Response } from 'express';
import { User } from '../../models';
import { tableManagerService } from '../../services';
export function leaveTable(req: Request, res: Response) {
  const user = (req as any)['USER'] as User;
  tableManagerService.leaveTable(user);

  res.status(200).json(undefined);
}
