import { Injectable } from '@angular/core';
import { Column } from '../models/column';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColumnService {

  constructor() { }

  getAllForBoard(boardId: number): Observable<Column[]> {
    return of([
      { id: 1, boardId: 1, position: 1, name: 'TODO' },
      { id: 2, boardId: 1, position: 2, name: 'Doing' },
      { id: 3, boardId: 1, position: 3, name: 'Done' },
    ]);
  }
}
