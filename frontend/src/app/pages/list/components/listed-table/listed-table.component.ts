import { Component, Input } from '@angular/core';
import { Table } from 'src/app/common/models';
import { ListService } from '../../list.service';

@Component({
  selector: 'list-listed-table',
  templateUrl: './listed-table.component.html',
  styleUrls: ['./listed-table.component.scss']
})
export class ListedTableComponent {
  @Input() table: Table;

  get isGameRunning(): boolean {
    return !this.table.canJoin;
  }

  constructor(private service: ListService) {}

  joinTable() {
    this.service.joinTable(this.table);
  }
}
