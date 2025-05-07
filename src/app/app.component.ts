import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TransferState, makeStateKey } from '@angular/platform-browser';

interface ToDo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private platformId: string;

  todos: ToDo[] = [];
  todosKey = makeStateKey<ToDo[]>("todos");

  constructor(@Inject(PLATFORM_ID) platformId: string, private http: HttpClient, private transferState: TransferState) {
    this.platformId = platformId;
  }

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      this.http
        .get<ToDo[]>('https://jsonplaceholder.typicode.com/todos')
        .subscribe(todos => {
          this.todos = todos.slice(0, 10);
          this.transferState.set(this.todosKey, this.todos);
        });
    } else if (isPlatformBrowser(this.platformId)) {
      this.todos = this.transferState.get(this.todosKey, []);
    }
  }
}
