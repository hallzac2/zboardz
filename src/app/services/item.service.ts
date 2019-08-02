import { ReorderableItemStore } from './../stores/reorderable-item-store';
import { Injectable } from '@angular/core';
import { Item } from '../models/item';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private store = new ReorderableItemStore<Item>('columnId');

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
