import { Request, Response } from 'express';
import { userManagerService } from '../../services';

export function getUser(req: Request, res: Response) {
  try {
    const userId = req.cookies['SESSIONID'];
    const user = userManagerService.findUserById(Number(userId));
    const userDto = user.toDto();
    res.status(200).json({ userDto });
  } catch {
    res.status(200).json({ userDto: undefined });
  }
}
