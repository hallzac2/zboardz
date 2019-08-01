import { Component, Input, OnInit } from '@angular/core';
import { Board } from 'src/app/models/board';
import { ColumnService } from 'src/app/services/column.service';
import { Column } from 'src/app/models/column';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @Input()
  board: Board;
  columns: Observable<Column[]>;
  allDropLists: string[];

  constructor(private columnService: ColumnService) { }

  ngOnInit() {
    this.columns = this.columnService.getAllForBoard(this.board.id).pipe(
      map(columns => columns.sort((left, right) => left.position - right.position)),
      tap(columns => this.allDropLists = columns.map(column => `${column.name}${column.id}`)),
    );
  }

  refreshColumns() {
    this.columns = this.columnService.getAllForBoard(this.board.id).pipe(
      map(columns => columns.sort((left, right) => left.position - right.position)),
      tap(columns => this.allDropLists = columns.map(column => `${column.name}${column.id}`)),
    );
  }
}
