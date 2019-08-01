import { Injectable } from '@angular/core';
import { Board } from '../models/board';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private boardsById: Map<number, Board> = new Map();

  constructor() {
    this.boardsById.set(1, { id: 1, name: 'Test Board' });
  }
  
  getById(id: number): Observable<Board> {
    return of(this.boardsById.get(id));
  }
}
