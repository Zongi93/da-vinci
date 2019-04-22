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
  @Input() aiAdded: boolean;

  get isSetupSupported(): boolean {
    return !this.aiAdded || this.gameInfo.aiSupported === this.aiAdded;
  }

  get isPlayerCountGood(): boolean {
    const table = this.service.table;
    const playerCount = table.players.length + table.addedAis;
    return (
      this.gameInfo.minPlayers <= playerCount &&
      this.gameInfo.maxPlayers >= playerCount
    );
  }

  constructor(private service: TableService) {}

  ngOnInit() {}

  startGame(): void {
    this.service.startGame(this.gameInfo);
  }
}
