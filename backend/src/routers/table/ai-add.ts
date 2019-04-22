import { Request, Response } from 'express';
import { User } from '../../models';
import { tableManagerService } from '../../services';

export function addAi(req: Request, res: Response) {
  const user = (req as any)['USER'] as User;
  tableManagerService.addAiToTable(user);
  res.status(200).json(undefined);
}
