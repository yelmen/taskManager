import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loginInterface } from '../interfaces/loginInterface';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Task } from '../interfaces/taskInterface';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {

  constructor(private http: HttpClient) {
  }

  login(user:loginInterface){
    return this.http.post(environment.loginApi, user).pipe(
      tap((response: any) => {
      }),
      catchError((error) => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  fetchUserInfo(){
    return this.http.get(environment.userInfo).pipe(
      tap((response: any) => {
      }),
      catchError((error) => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  insertTask(task: Task): Observable<Task> {
    return this.http.post(`${environment.mock}/insert`, task).pipe(
      map((response: any) => response as Task),
      tap((response: Task) => {
        console.log('response:', response);
      }),
      catchError((error) => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }


  deleteTask(taskId: string): Observable<Task> {
    return this.http.delete(`${environment.mock}/insert/${taskId}`).pipe(
      map((response: any) => response as Task),
      tap((response: Task) => {
        console.log('response:', response);
      }),
      catchError((error) => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  updateStatus(taskId: string, updatedTask: Task): Observable<Task> {
    return this.http.put<Task>(`${environment.mock}/insert/${taskId}`, updatedTask);
  }

  updateTaskDetail(taskId: string, updatedTask: Task): Observable<Task> {
    return this.http.put<Task>(`${environment.mock}/insert/${taskId}`, updatedTask);
  }

  fetchTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${environment.mock}/insert`);
  }
}
