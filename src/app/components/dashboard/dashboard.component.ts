import { Component, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RoutingService } from 'src/app/services/routing.service';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { MessengerService } from 'src/app/services/messenger.service';
import { CrudService } from 'src/app/services/crud.service';
import { LoginServiceService } from 'src/app/services/login-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {

  readonly dialog = inject(MatDialog);
  declare selected: string;
  disabled = true;
  user: any = {};

  constructor(
    private routingService: RoutingService,
    private messengerService: MessengerService,
    private crud: CrudService,
    private loginService: LoginServiceService
  ) {
    //Assigne the Dashboard as default
    this.selected = 'Dashboard';
    this.fetchUser();
  }

  //open create Task Dialog
  openCreateTaskDialog() {
    //assingne the Create
    this.selected = 'Create';
    this.dialog
      .open(CreateTaskComponent, {
        width: '55vw',
        height: '60vh',
      })
      .afterClosed()
      .subscribe((event) => {
        this.selected = 'Dashboard';
        if (event.action == 'insert') {
          //if user created new task i am letting the task-dahboard component know about it and fetch the new task from API
          this.crud.insert(event.value).subscribe(() => {
            this.messengerService.notifyTaskUpdate();
          });
        }
      });
  }

  doLogOut() {
    this.routingService.navigateToLogin();
    this.selected = 'Logout';
  }

  navigateToDashboard() {
    this.routingService.navigateToDashboard();
    this.selected = 'Dashboard';
  }

  private fetchUser() {
    this.loginService.fetchUserInfo().subscribe((el) => {
      this.user = el.data;
    });
  }
}
