import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef, NgZone, HostListener } from '@angular/core';
import { Column } from 'src/app/models/column';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from 'src/app/models/item';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss']
})
export class ColumnComponent implements OnInit {

  @Input()
  column: Column;
  @Input()
  allDropLists: string[];
  @Output()
  itemSwitchedColumn: EventEmitter<{ oldColumn: number, newColumn: number }> = new EventEmitter();
  $items: Observable<Item[]>;

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.refreshItems();
  }

  addItem(name: string) {
    const item: Item = { columnId: this.column.id, name };
    this.itemService.add(item);
    this.refreshItems();
  }

  onDrop(event) {
    const item: Item = event.item.data;
    const targetPosition = event.currentIndex;

    if (this.column.id !== item.columnId) {
      this.handleMoveItemToColumn(item, targetPosition);
    } else if (event.currentIndex !== event.previousIndex) {
      this.handleReorderItems(item, targetPosition);
    }
  }

  refreshItems() {
    this.$items = this.itemService.getAllItemsForColumn(this.column.id).pipe(
      map(items => items.sort((left, right) => left.position - right.position))
    );
  }

  private handleMoveItemToColumn(item: Item, targetPosition: number) {
    this.itemService.moveItemToColumn(item, this.column.id, targetPosition);
    this.itemSwitchedColumn.emit({ oldColumn: item.columnId, newColumn: this.column.id });
  }

  private handleReorderItems(item: Item, targetPosition: number) {
    this.itemService.moveItemToPosition(item, targetPosition);
    this.refreshItems();
  }
}
