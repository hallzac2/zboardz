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
  itemSwitchedColumn: EventEmitter<{ oldColumn: number, newCoulumn: number }> = new EventEmitter();
  @ViewChild('itemNameEl', { static: false })
  itemNameEl: ElementRef;
  items: Observable<Item[]>;
  addModeEnabled = false;

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.refreshItems();
  }

  toggleAddMode(value: boolean) {
    this.addModeEnabled = value;
    if (this.addModeEnabled) {
      this.focusItemNameInput();
    }
  }

  addItem() {
    const itemNameNativeEl = this.itemNameEl.nativeElement;
    if (itemNameNativeEl.value) {
      const item: Item = { columnId: this.column.id, name: itemNameNativeEl.value };
      this.itemService.add(item);
      this.refreshItems();
      itemNameNativeEl.value = '';
      this.focusItemNameInput();
    }
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

  private refreshItems() {
    this.items = this.itemService.getAllItemsForColumn(this.column.id).pipe(
      map(items => items.sort((left, right) => left.position - right.position))
    );
  }

  private handleMoveItemToColumn(item: Item, targetPosition: number) {
    this.itemService.delete(item);
    const newItem = { ...item, columnId: this.column.id };
    this.itemService.moveItemToPosition(newItem, targetPosition);
    this.itemSwitchedColumn.emit({ oldColumn: item.columnId, newCoulumn: this.column.id });
  }

  private handleReorderItems(item: Item, targetPosition: number) {
    this.itemService.moveItemToPosition(item, targetPosition);
    this.refreshItems();
  }

  private focusItemNameInput() {
    // Use setTimeout to allow for the zone to stabilize
    setTimeout(() => this.itemNameEl.nativeElement.focus());
  }
}
