import { ReorderableItemStore } from './../stores/reorderable-item-store';
import { Injectable } from '@angular/core';
import { Item } from '../models/item';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private store = new ReorderableItemStore<Item>('columnId');

  constructor() {
    this.store.add({ columnId: 1, name: '1' });
    this.store.add({ columnId: 1, name: '2' });
    this.store.add({ columnId: 1, name: '3' });
    this.store.add({ columnId: 1, name: '4' });
    this.store.add({ columnId: 2, name: '5' });
    this.store.add({ columnId: 2, name: '6' });
    this.store.add({ columnId: 2, name: '7' });
    this.store.add({ columnId: 2, name: '8' });
    this.store.add({ columnId: 3, name: '9' });
    this.store.add({ columnId: 3, name: '10' });
    this.store.add({ columnId: 3, name: '11' });
    this.store.add({ columnId: 3, name: '12' });
  }

  getAllItemsForColumn(columnId: number): Observable<Item[]> {
    return this.store.getAllForKey(columnId);
  }

  add(item: Item) {
    return this.store.add(item);
  }

  delete(item: Item) {
    this.store.delete(item);
  }

  moveItemToColumn(item: Item, columnId: number, targetPosition: number) {
    this.delete(item);
    const addedItem = this.add({ columnId, name: item.name });
    this.moveItemToPosition(addedItem, targetPosition);
  }

  moveItemToPosition(item: Item, targetPosition: number) {
    this.store.moveItemToPosition(item, targetPosition);
  }
}
