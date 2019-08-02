import { ReorderableItem } from '../stores/reorderable-item';

export interface Item extends ReorderableItem {
  columnId: number;
  name: string;
}
