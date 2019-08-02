import { ColumnComponent } from './../column/column.component';
import { Component, Input, OnInit, ViewChildren } from '@angular/core';
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
  @ViewChildren(ColumnComponent)
  columnComponents: ColumnComponent[];
  $columns: Observable<Column[]>;
  allDropLists: string[];

  constructor(private columnService: ColumnService) { }

  ngOnInit() {
    this.$columns = this.columnService.getAllForBoard(this.board.id).pipe(
      map(columns => columns.sort((left, right) => left.position - right.position)),
      tap(columns => this.allDropLists = columns.map(column => `${column.name}${column.id}`)),
    );
  }

  handleItemSwitchedColumn(payload: { oldColumn: number, newColumn: number }) {
    this.columnComponents
      .filter(columnComponent => {
        const column = columnComponent.column;
        return column.id === payload.oldColumn || column.id === payload.newColumn;
      })
      .forEach(columnComponent => columnComponent.refreshItems());
  }
}
