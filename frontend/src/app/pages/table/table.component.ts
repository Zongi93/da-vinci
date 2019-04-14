import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TableGameInfo } from 'src/app/table-games';
import { TableService } from './table.service';

@Component({
  selector: 'table-page',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  get gameInfos(): Array<TableGameInfo> {
    return TableGameInfo.list;
  }

  constructor(private service: TableService, route: ActivatedRoute) {
    service.init(Number(route.snapshot.queryParams['token']));
  }

  ngOnInit() {
    console.log('hi!');
  }
}
