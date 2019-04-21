import { Component, OnInit } from '@angular/core';
import { DavinciService } from '../../davinci.service';

@Component({
  selector: 'game-davinci-game-over-screen',
  templateUrl: './game-over-screen.component.html',
  styleUrls: ['./game-over-screen.component.scss']
})
export class GameOverScreenComponent implements OnInit {
  get showGameOverScreen(): boolean {
    return !!this.service.winnerName;
  }

  get IAreWinner(): boolean {
    return this.service.playerName === this.service.winnerName;
  }

  get winnerName(): string {
    return this.service.winnerName;
  }

  constructor(private service: DavinciService) {}

  ngOnInit() {}

  onOkay(): void {
    this.service.gameOverAcknowledged();
  }
}
