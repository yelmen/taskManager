import { Injectable } from '@angular/core';
import { LoaderAndInfoService } from './loader-and-info.service';
import { HttpRequestService } from './http-request.service';
import { Task } from '../interfaces/taskInterface';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  constructor(
    private httpRequestService: HttpRequestService,
    private infoService: LoaderAndInfoService
  ) {}

  insert(task: Task): Observable<Task> {
    this.infoService.showSpinner();
    return this.httpRequestService.insertTask(task).pipe(
      tap((el) => {
        this.infoService.hideSpinner();
        if (el.id) {
          this.infoService.showMessage('Task Generated Successfully');
        } else {
          alert('Something went wrong #6493');
        }
      }),
      catchError((error) => {
        this.infoService.hideSpinner();
        return throwError(error);
      })
    );
  }

  delete(taskId: string): Observable<Task> {
    this.infoService.showSpinner();
    return this.httpRequestService.deleteTask(taskId).pipe(
      tap(() => {
        this.infoService.hideSpinner();
        this.infoService.showMessage('Task Deleted Successfully');
      }),
      catchError((error) => {
        this.infoService.hideSpinner();
        return throwError(error);
      })
    );
  }

  updateTask(taskId: string, task: Task): Observable<Task> {
    this.infoService.showSpinner();
    return this.httpRequestService.updateTaskDetail(taskId, task).pipe(
      tap((el) => {
        this.infoService.hideSpinner();
        this.infoService.showMessage('Task Updated Successfully');
      }),
      catchError((error) => {
        this.infoService.hideSpinner();
        return throwError(error);
      })
    );
  }


  updateStatus(taskId:string,task: Task): Observable<Task> {
    this.infoService.showSpinner();
    return this.httpRequestService.updateStatus(taskId, task).pipe(
      tap((el) => {
        this.infoService.hideSpinner();
        this.infoService.showMessage('Task Updated Successfully');
      }),
      catchError((error) => {
        this.infoService.hideSpinner();
        return throwError(error);
      })
    );
  }

  fetchAll(): Observable<Task[]> {
    return this.httpRequestService.fetchTasks().pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
}
