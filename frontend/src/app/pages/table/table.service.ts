import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Table } from 'src/app/common/models';
import { IWebSocketController } from 'src/app/common/services';
import { TableGameInfo } from 'src/app/table-games';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private selectedTableId: number;
  private tableList: Array<Table>;

  get selectedTable(): Table {
    return this.tableList.find(table => table.id === this.selectedTableId);
  }

  constructor(
    private socketService: IWebSocketController,
    private router: Router
  ) {
    socketService.tableList$.subscribe(update => (this.tableList = update));

    socketService.tableList$
      .pipe(
        map(tables => tables.find(table => table.id === this.selectedTableId)),
        filter(table => !!table),
        map(table => table.gameTitle),
        filter((gameTitle: string) => !!gameTitle && gameTitle.length > 0)
      )
      .subscribe(gameTitle => {
        const selectedGameInfo = TableGameInfo.list.find(
          gameInfo => gameInfo.title === gameTitle
        );
        this.launchGame(selectedGameInfo);
      });
  }

  init(tableId: number) {
    this.selectedTableId = tableId;
  }

  startGame(gameInfo: TableGameInfo) {
    this.socketService.startGame(gameInfo);
  }

  launchGame(gameInfo: TableGameInfo) {
    const token = this.selectedTableId.toString();
    this.router.navigate([`/table/${gameInfo.path}`], {
      queryParams: { token }
    });
  }

  validateUrl(route: ActivatedRouteSnapshot): boolean {
    return true;
  }
}
