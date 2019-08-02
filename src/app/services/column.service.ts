import { Injectable } from '@angular/core';
import { Column } from '../models/column';
import { Observable, of } from 'rxjs';
import { ReorderableItemStore } from '../stores/reorderable-item-store';

@Injectable({
  providedIn: 'root'
})
export class ColumnService {

  private store = new ReorderableItemStore<Column>('boardId');

  getAllForBoard(boardId: number): Observable<Column[]> {
    return this.store.getAllForKey(boardId);
  }

  add(column: Column) {
    return this.store.add(column);
  }

  delete(column: Column) {
    this.store.delete(column);
  }

  moveItemToColumn(column: Column, boardId: number, targetPosition: number) {
    this.delete(column);
    const addedItem = this.add({ boardId, name: column.name });
    this.moveItemToPosition(addedItem, targetPosition);
  }

  moveItemToPosition(column: Column, targetPosition: number) {
    this.store.moveItemToPosition(column, targetPosition);
  }
}
