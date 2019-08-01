import { Injectable } from '@angular/core';
import { Item } from '../models/item';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private itemsByColumnId: Map<number, Item[]> = new Map();

  constructor() {
    this.itemsByColumnId.set(1, [
      { id: 1, columnId: 1, position: 0, name: 'test 1' },
      { id: 2, columnId: 1, position: 1, name: 'test 2' },
      { id: 3, columnId: 1, position: 2, name: 'test 3' },
      { id: 4, columnId: 1, position: 3, name: 'test 4' },
    ]);

    this.itemsByColumnId.set(2, [
      { id: 5, columnId: 2, position: 0, name: 'test 1' },
      { id: 6, columnId: 2, position: 1, name: 'test 2' },
    ]);

    this.itemsByColumnId.set(3, [
      { id: 7, columnId: 3, position: 1, name: 'test 3' },
      { id: 8, columnId: 3, position: 0, name: 'test 4' },
    ]);
  }

  getAllItemsForColumn(columnId: number): Observable<Item[]> {
    return of(this.itemsByColumnId.get(columnId));
  }

  add(item: Item) {
    const columnId = item.columnId;
    const id = this.findMaxForItemInColumn('id', columnId) + 1;
    const position = this.findMaxForItemInColumn('position', columnId) + 1;
    const itemToAdd = { ...item, id, position };
    this.itemsByColumnId.get(columnId).push(itemToAdd);
  }

  delete(itemToDelete: Item) {
    const newItems = this.itemsByColumnId.get(itemToDelete.columnId)
      .filter(item => item.id !== itemToDelete.id)
      .map(item => {
        return item.position > itemToDelete.position ? { ...item, position: item.position - 1 } : item;
      });
    this.itemsByColumnId.set(itemToDelete.columnId, newItems);
  }

  moveItemToPosition(itemToMove: Item, targetPosition: number) {
      const newItems = this.itemsByColumnId.get(itemToMove.columnId)
        .filter(item => item.id !== itemToMove.id)
        .map(item => {
          return {
            ...item,
            position: this.determineNewPosition(targetPosition, itemToMove.position, item.position)
          };
        });

      newItems.push({ ...itemToMove, position: targetPosition });
      this.itemsByColumnId.set(itemToMove.columnId, newItems);
  }

  private determineNewPosition(newPos: number, oldPos: number, itemPos: number) {
    let newPosition = itemPos;
    if (oldPos < newPos && itemPos <= newPos && itemPos > oldPos) {
      // Move forward in list, so find set between and decrement
      // 0, 1, 2, 3, 4 => move 0 to 3, so decrement 3, 2, 1
      newPosition--;
    } else if (oldPos > newPos && itemPos >= newPos && itemPos < oldPos) {
      // Move back in list, so find set between and increment
      // 0, 1, 2, 3, 4 => move 3 to 0, so increment 0, 1, 2
      newPosition++;
    }
    return newPosition;
  }

  private findMaxForItemInColumn(prop: 'id' | 'position', columnId: number): number {
    return this.itemsByColumnId.get(columnId)
      .map(item => item[prop])
      .reduce((left, right) => (left > right) ? left : right);
  }
}
