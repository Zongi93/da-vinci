import { Component, Input, OnInit } from '@angular/core';
import { TableGameInfo } from 'src/app/table-games';
import { TableService } from '../../table.service';

@Component({
  selector: 'table-listed-game',
  templateUrl: './listed-game.component.html',
  styleUrls: ['./listed-game.component.scss']
})
export class ListedGameComponent implements OnInit {
  @Input() gameInfo: TableGameInfo;

  constructor(private service: TableService) {}

  isPlayerCountGood(): boolean {
    const playerCount = this.service.selectedTable.players.length;
    return (
      this.gameInfo.minPlayers <= playerCount &&
      this.gameInfo.maxPlayers >= playerCount
    );
  }

  startGame(): void {
    this.service.startGame(this.gameInfo);
  }

  ngOnInit() {}
}
