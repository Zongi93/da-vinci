import { Request, Response } from 'express';
import { User } from '../../models';
import { socketManagerService, userManagerService } from '../../services';

export function pairSocket(req: Request, res: Response) {
  const user = (req as any)['USER'] as User;
  const socketId = req.cookies['io'];

  if (!!socketManagerService.findSocketById(socketId)) {
    userManagerService.pairSocketWithUser(user, socketId);
    res.status(200).json(undefined);
  } else {
    res.status(403);
  }
}
