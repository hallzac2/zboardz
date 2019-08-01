import { Component } from '@angular/core';
import { BoardService } from './services/board.service';
import { Observable } from 'rxjs';
import { Board } from './models/board';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'zboardz';

  constructor(private boardService: BoardService) { }

  getBoard(): Observable<Board> {
    return this.boardService.getById(1);
  }
}
