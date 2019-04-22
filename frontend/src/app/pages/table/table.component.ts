import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TableGameInfo } from 'src/app/table-games';
import { TableService } from './table.service';

@Component({
  selector: 'table-page',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  get gameInfos(): Array<TableGameInfo> {
    return TableGameInfo.list;
  }

  get playerNames(): Array<string> {
    const names = [...this.service.table.players];
    for (let i = 1; i <= this.service.table.addedAis; i++) {
      names.push(`Computer ${i}`);
    }
    return names;
  }

  get isAiAdded(): boolean {
    return this.service.table.addedAis > 0;
  }

  constructor(private service: TableService) {
    const runningGame = TableGameInfo.find(service.table.gameTitle);
    if (!!runningGame) {
      service.launchGame(runningGame);
    }
  }

  ngOnInit(): void {
    this.subscription = this.service.table$
      .pipe(
        filter(table => !!table),
        map(table => TableGameInfo.find(table.gameTitle)),
        filter(game => !!game)
      )
      .subscribe(game => this.service.launchGame(game));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addAiOpponent() {
    this.service.addAiOpponent();
  }

  removeAiOpponent() {
    this.service.removeAiOpponent();
  }

  leaveTable() {
    this.service.leaveTable();
  }
}
