import { Injectable } from '@angular/core';
import { loginInterface } from '../interfaces/loginInterface';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { HttpRequestService } from './http-request.service';
import { RoutingService } from './routing.service';
import { LoaderAndInfoService } from './loader-and-info.service';

@Injectable({
  providedIn: 'root',
})
export class LoginServiceService {
  constructor(
    private httpRequestService: HttpRequestService,
    private routingService: RoutingService,
    private infoService: LoaderAndInfoService
  ) {}

  login(user: loginInterface): Observable<any> {
    return this.httpRequestService.login(user).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('jwt', res.token);
          this.routingService.navigateToDashboard();
          this.infoService.showMessage('Login Succesfull');
        } else {
          alert('There was something went wrong #4893');
        }
      }),
      catchError((error) => {
        this.infoService.showMessage('User email or password wrong!');
        return throwError(error); // Hata döndür
      })
    );
  }

  fetchUserInfo(): Observable<any> {
    return this.httpRequestService.fetchUserInfo().pipe(
      tap((res: any) => {
        if (!res)
          alert('There was something went wrong #3946');
      }),
      catchError((error) => {
        alert('There was something went wrong #3948');
        return throwError(error); // Hata döndür
      })
    );
  }
}
