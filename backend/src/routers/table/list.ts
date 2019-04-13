import { Request, Response } from 'express';
import { tableManagerService } from '../../services';

export function listTables(req: Request, res: Response) {
  const tables = tableManagerService.listTables();
  const tablesDto = tables.map(table => table.toDto());
  res.status(200).json({ tablesDto });
}
