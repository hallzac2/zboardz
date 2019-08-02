import { Observable, of } from 'rxjs';
import { ReorderableItem } from './reorderable-item';

export class ReorderableItemStore<T extends ReorderableItem> {

  private nextId = 1;
  private store = new Map<number, T[]>();

  constructor(private mapByProp: string) {}

  getAllForKey(key: number): Observable<T[]> {
    return of(this.store.get(key) || []);
  }

  add(item: T) {
    const key = item[this.mapByProp];
    if (!this.store.has(key)) {
      this.store.set(key, []);
    }

    const id = this.determineNextId();
    const position = this.determineNextPosition(key);
    const itemToAdd = { ...item, id, position };
    this.store.get(key).push(itemToAdd);

    return itemToAdd;
  }

  delete(itemToDelete: T) {
    const newItems = this.store.get(itemToDelete[this.mapByProp])
      .filter(item => item.id !== itemToDelete.id)
      .map(item => {
        return item.position > itemToDelete.position ? { ...item, position: item.position - 1 } : item;
      });
    this.store.set(itemToDelete[this.mapByProp], newItems);
  }

  moveItemToPosition(itemToMove: T, targetPosition: number) {
    const newItems = this.store.get(itemToMove[this.mapByProp])
      .filter(item => item.id !== itemToMove.id)
      .map(item => {
        return {
          ...item,
          position: this.determineNewPosition(targetPosition, itemToMove.position, item.position)
        };
      });

    newItems.push({ ...itemToMove, position: targetPosition });
    this.store.set(itemToMove[this.mapByProp], newItems);
  }

  private determineNextId() {
    const id = this.nextId;
    this.nextId++;
    return id;
  }

  private determineNextPosition(columnId: number): number {
    const items = this.store.get(columnId);
    let position = 0;

    if (items.length > 0) {
      position = 1 + this.store.get(columnId)
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
