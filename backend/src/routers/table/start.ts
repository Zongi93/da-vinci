import { Request, Response } from 'express';
import { User } from '../../models';
import { tableManagerService } from '../../services';
export function startTable(req: Request, res: Response) {
  const user = (req as any)['USER'] as User;
  const gameTitle = req.body.gameTitle;
  console.log(`${user.userName} requested to start a game: ${gameTitle}`);
  tableManagerService.startTable(user, gameTitle);

  res.status(200).json(undefined);
}
