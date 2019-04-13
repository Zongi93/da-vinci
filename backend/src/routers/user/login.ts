import { Request, Response } from 'express';
import { userManagerService } from '../../services';
import { generateXsrfToken } from '../../utils/security';

export function loginUser(req: Request, res: Response) {
  const username = req.body.userName;
  const user = userManagerService.login(username);
  const userDto = user.toDto();

  res.cookie('SESSIONID', user.id, { httpOnly: true, secure: false });

  res.cookie('XSRF-TOKEN', generateXsrfToken());

  res.status(200).json({ userDto });
}
