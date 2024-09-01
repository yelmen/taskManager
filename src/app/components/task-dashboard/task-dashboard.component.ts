import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Task } from 'src/app/interfaces/taskInterface';
import { CrudService } from 'src/app/services/crud.service';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { Subscription } from 'rxjs';
import { MessengerService } from 'src/app/services/messenger.service';
import { LoaderAndInfoService } from 'src/app/services/loader-and-info.service';

@Component({
  selector: 'app-task-dashboard',
  templateUrl: './task-dashboard.component.html',
  styleUrls: ['./task-dashboard.component.scss'],
})
export class TaskDashboardComponent implements AfterViewInit {
  readonly dialog = inject(MatDialog);
  private declare messengerSubscription$: Subscription;
  isLoaded = false;
  backlog: Task[] = [];
  active: Task[] = [];
  testing: Task[] = [];
  acceptance: Task[] = [];

  filteredBacklog: Task[] = [];
  filteredActive: Task[] = [];
  filteredTesting: Task[] = [];
  filteredAcceptance: Task[] = [];

  constructor(
    private crud: CrudService,
    private messengerService: MessengerService,
    private cdRef: ChangeDetectorRef, // Inject ChangeDetectorRef
    private infoService: LoaderAndInfoService
  ) {}

  ngAfterViewInit(): void {
    this.messengerSubscription$ = this.messengerService.taskUpdate$.subscribe(
      //when the create dialog opened and new task created, i am listening the messenger service and refresh the arrays
      () => {
        this.fetchAll();
      }
    );
    this.fetchAll();
  }

  fetchAll() {
    this.crud.fetchAll().subscribe((tasks: Task[]) => {
      //fake delay to show skeleton loader on initialize the component
      setTimeout(() => {
        this.isLoaded==false ? this.isLoaded = true: "";
        this.infoService.hideSpinner();
        this.backlog = [];
        this.active = [];
        this.testing = [];
        this.acceptance = [];
        tasks.forEach((task) => {
          const statusNumber = Number(task.status);
          switch (statusNumber) {
            case 0:
              this.backlog.push(task);
              break;
            case 1:
              this.active.push(task);
              break;
            case 2:
              this.testing.push(task);
              break;
            case 3:
              this.acceptance.push(task);
              break;
            default:
              console.warn(`Unknown status: ${statusNumber}`);
              break;
          }
        });

        // Initialize filtered arrays
        this.filteredBacklog = [...this.backlog];
        this.filteredActive = [...this.active];
        this.filteredTesting = [...this.testing];
        this.filteredAcceptance = [...this.acceptance];

        this.infoService.hideSpinner();
        this.cdRef.detectChanges();
        this.cdRef.markForCheck();
      }, 800);
    });
  }
  //Basic filtering for each array by assignedTo
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredBacklog = this.backlog.filter((task) =>
      task.assignedTo.toLowerCase().includes(filterValue)
    );
    this.filteredActive = this.active.filter((task) =>
      task.assignedTo.toLowerCase().includes(filterValue)
    );
    this.filteredTesting = this.testing.filter((task) =>
      task.assignedTo.toLowerCase().includes(filterValue)
    );
    this.filteredAcceptance = this.acceptance.filter((task) =>
      task.assignedTo.toLowerCase().includes(filterValue)
    );
  }
  //Basic sorting by A-z Z-a and Asc-Desc
  applySorting(sortBy: string) {
    const sortFunc = (a: Task, b: Task) => {
      switch (sortBy) {
        case 'dateAsc':
          return (
            new Date(a.createDate).getTime() - new Date(b.createDate).getTime()
          );
        case 'dateDesc':
          return (
            new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
          );
        case 'alphaAsc':
          return a.title.localeCompare(b.title);
        case 'alphaDesc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    };

    this.filteredBacklog.sort(sortFunc);
    this.filteredActive.sort(sortFunc);
    this.filteredTesting.sort(sortFunc);
    this.filteredAcceptance.sort(sortFunc);
  }

  drop(event: CdkDragDrop<Task[]>) {
    // If the item is moved within the same container
    if (event.previousContainer === event.container) {
      // Reorder the item within the same container
      moveItemInArray(
        event.container.data, // Current data of the container
        event.previousIndex, // Previous index
        event.currentIndex // New index
      );
    } else {
      // If the item is moved between different containers
      transferArrayItem(
        event.previousContainer.data,// Data of the previous container
        event.container.data,// Data of the new containe
        event.previousIndex,// Previous index
        event.currentIndex// New index
      );
      // Get the moved item
      const task = event.container.data[event.currentIndex];
      // Get the status based on the new container's ID
      const newStatus = this.getStatusFromContainerId(event.container.id);
      task.status = newStatus;
      // Update the status of the task
      this.crud.updateStatus(task.id + '', task).subscribe(() => {
        this.fetchAll()
      });
    }
  }

  private getStatusFromContainerId(containerId: string): number {
    switch (containerId) {
      case 'cdk-drop-list-0':
        return 0;
      case 'cdk-drop-list-1':
        return 1;
      case 'cdk-drop-list-2':
        return 2;
      case 'cdk-drop-list-3':
        return 3;
      default:
        console.warn(`Unknown container ID: ${containerId}`);
        return -1; // unexpected situation
    }
  }

  //opening the dialog
  openCreateTaskDialog(task: Task) {
    this.dialog
      .open(CreateTaskComponent, {
        width: '55vw',
        height: '60vh',
        data: task,
      })
      .afterClosed()
      .subscribe((result) => {
        //if data is passed to dialog user can do either update or delete, i am passing the parameter via afterClosed() and doing the process
        if (result?.action === 'update') {
          this.crud.updateTask(task.id + '', result.value).subscribe(() => {
            //update the tasks
            this.fetchAll();
          });
        } else if (result?.action === 'delete') {
          this.crud.delete(task.id + '').subscribe(() => {
            //update the tasks
            this.fetchAll();
          });
        }
      });
  }
}
