import { Component, Input, HostListener, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent {

  @Input()
  buttonText: string;
  @Input()
  placeholderText: string;
  @Output()
  addedInput: EventEmitter<string> = new EventEmitter();
  @ViewChild('itemNameEl', { static: false })
  itemNameEl: ElementRef;
  addModeEnabled = false;
  private sourcedClickEvent = false;

  add($event) {
    $event.stopPropagation();
    const itemNameNativeEl = this.itemNameEl.nativeElement;
    const value = itemNameNativeEl.value;

    if (value) {
      this.addedInput.emit(value);
      itemNameNativeEl.value = '';
    }
    this.focusItemNameInput();
  }

  enableAddMode() {
    this.sourcedClickEvent = true;
    this.addModeEnabled = true;
    this.focusItemNameInput();
  }

  disableAddMode() {
    this.addModeEnabled = false;
  }

  @HostListener('document:click')
  handleOutsideClick() {
    if (!this.sourcedClickEvent) {
      this.disableAddMode();
    } else {
      this.sourcedClickEvent = false;
    }
  }

  private focusItemNameInput() {
    // Use setTimeout to allow for the zone to stabilize
    setTimeout(() => this.itemNameEl.nativeElement.focus());
  }
}
