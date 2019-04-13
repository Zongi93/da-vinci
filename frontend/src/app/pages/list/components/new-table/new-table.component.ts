import { Component, OnInit } from '@angular/core';
import { ListService } from '../../list.service';

@Component({
  selector: 'list-new-table',
  templateUrl: './new-table.component.html',
  styleUrls: ['./new-table.component.scss']
})
export class NewTableComponent implements OnInit {
  constructor(public service: ListService) {}

  ngOnInit() {}

  createNewTable(): void {
    this.service.createTable();
  }
}
