import { ReorderableItem } from '../stores/reorderable-item';

export interface Column extends ReorderableItem {
  boardId: number;
  name: string;
}
