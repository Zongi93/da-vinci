import { Component, ElementRef, ViewChild } from '@angular/core';
import { IDavinciSocketService } from '../../data-provider.service';

@Component({
  selector: 'game-davinci-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  @ViewChild('.chat') private chatWindow: ElementRef;
  readonly messages: Array<string> = [];

  constructor(socketService: IDavinciSocketService) {
    socketService.infoMessage$.subscribe(message => {
      this.messages.push(message);
      try {
        this.chatWindow.nativeElement.scrollTop = this.chatWindow.nativeElement.scrollHeight;
      } catch {}
    });
  }
}
