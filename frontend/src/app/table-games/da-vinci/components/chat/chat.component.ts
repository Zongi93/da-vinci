import { Component, OnInit } from '@angular/core';
import { IDavinciSocketService } from '../../data-provider.service';

@Component({
  selector: 'game-davinci-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  readonly messages: Array<string> = [];

  constructor(socketService: IDavinciSocketService) {
    socketService.infoMessage$.subscribe(message =>
      this.messages.push(message)
    );
  }

  ngOnInit() {}
}
