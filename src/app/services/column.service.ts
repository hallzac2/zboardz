import { Injectable } from '@angular/core';
import { Column } from '../models/column';
import { Observable, of } from 'rxjs';
import { ReorderableItemStore } from '../stores/reorderable-item-store';

@Injectable({
  providedIn: 'root'
})
export class ColumnService {

  private store = new ReorderableItemStore<Column>('boardId');

  constructor() {
    this.store.add({ boardId: 1, name: 'TODO' });
    this.store.add({ boardId: 1, name: 'DOING' });
    this.store.add({ boardId: 1, name: 'DONE' });
  }

  getAllForBoard(boardId: number): Observable<Column[]> {
    return this.store.getAllForKey(boardId);
  }
}
