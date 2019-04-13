import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ListService } from './list.service';

@Component({
  selector: 'list-page',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  userNameForm: FormControl = new FormControl();

  constructor(public service: ListService) {}

  login(userName: string) {
    this.service.login(userName);
  }

  ngOnInit() {}
}
