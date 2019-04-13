import { Request, Response } from 'express';
import { User } from '../../models';
import { tableManagerService } from '../../services';

export function createTable(req: Request, res: Response) {
  const user = (req as any)['USER'] as User;
  console.log(`${user.userName} requested a new table`);
  tableManagerService.createTable(user);

  res.status(200).json(undefined);
}
