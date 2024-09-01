import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessengerService {
  private taskUpdateSubject = new Subject<void>();

  // Observable is going to listening by task-dashboard.component.ts
  taskUpdate$ = this.taskUpdateSubject.asObservable();

  // triggers the event
  notifyTaskUpdate() {
    this.taskUpdateSubject.next();
  }
}
