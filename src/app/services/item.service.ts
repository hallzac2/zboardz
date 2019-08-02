import { Injectable } from '@angular/core';
import { Item } from '../models/item';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private nextId = 9;
  private itemsByColumnId: Map<number, Item[]> = new Map();

  constructor() {
    this.add({ columnId: 1, name: '1' });
    this.add({ columnId: 1, name: '2' });
    this.add({ columnId: 1, name: '3' });
    this.add({ columnId: 1, name: '4' });
    this.add({ columnId: 2, name: '5' });
    this.add({ columnId: 2, name: '6' });
    this.add({ columnId: 2, name: '7' });
    this.add({ columnId: 2, name: '8' });
    this.add({ columnId: 3, name: '9' });
    this.add({ columnId: 3, name: '10' });
    this.add({ columnId: 3, name: '11' });
    this.add({ columnId: 3, name: '12' });
  }

  getAllItemsForColumn(columnId: number): Observable<Item[]> {
    return of(this.itemsByColumnId.get(columnId) || []);
  }

  add(item: Item) {
    const columnId = item.columnId;
    if (!this.itemsByColumnId.has(columnId)) {
      this.itemsByColumnId.set(columnId, []);
    }

    const id = this.determineNextId();
    const position = this.determineNextPosition(columnId);
    const itemToAdd = { ...item, id, position };
    this.itemsByColumnId.get(columnId).push(itemToAdd);

    return itemToAdd;
  }

  delete(itemToDelete: Item) {
    const newItems = this.itemsByColumnId.get(itemToDelete.columnId)
      .filter(item => item.id !== itemToDelete.id)
      .map(item => {
        return item.position > itemToDelete.position ? { ...item, position: item.position - 1 } : item;
      });
    this.itemsByColumnId.set(itemToDelete.columnId, newItems);
  }

  moveItemToColumn(item: Item, columnId: number, targetPosition: number) {
    this.delete(item);
    const addedItem = this.add({ columnId, name: item.name });
    this.moveItemToPosition(addedItem, targetPosition);
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

  private determineNextId() {
    const id = this.nextId;
    this.nextId++;
    return id;
  }

  private determineNextPosition(columnId: number): number {
    const items = this.itemsByColumnId.get(columnId);
    let position = 0;

    if (items.length > 0) {
      position = 1 + this.itemsByColumnId.get(columnId)
        .map(item => item.position)
        .reduce((left, right) => (left > right) ? left : right);
    }
    return position;
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
}
