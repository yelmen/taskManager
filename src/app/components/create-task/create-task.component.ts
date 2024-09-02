import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from 'src/app/interfaces/taskInterface';
import { LoginServiceService } from 'src/app/services/login-service.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
})
export class CreateTaskComponent implements OnInit {
  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task,
    private loginService: LoginServiceService
  ) {
    this.taskForm = this.fb.group({
      title: [data?.title || '', Validators.required],
      description: [data?.description || '', Validators.required],
      assignedTo: [data?.assignedTo || '', Validators.required],
      status: [data?.status || 0, Validators.required],
      createDate: [data?.createDate || new Date()],
      lastUpdateDate: [data?.lastUpdateDate || new Date()],
      fromId: [''], 
      fromName: [''], 
    });
  }

  ngOnInit(): void {
    this.loginService.fetchUserInfo().subscribe((response) => {
      const userId = response.data.id;
      const userName = response.data.first_name;
      this.taskForm.patchValue({
        fromId: userId,
        fromName: userName,
      });
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      if (!this.data) {
        this.onCancel({ action: 'insert', value: this.taskForm.value as Task });
      } else {
        this.onCancel({ action: 'update', value: this.taskForm.value as Task });
      }
    }
  }
  delete() {
    this.onCancel({ action: 'delete' });
  }

  onCancel(event: any): void {
    this.dialogRef.close(event);
  }


  getStatus(status: number): string {
    switch (status) {
      case 0:
        return 'Backlog';
      case 1:
        return 'Active';
      case 2:
        return 'Testing';
      case 3:
        return 'Acceptance';
      default:
        return 'Please Select Status'; 
    }
  }
}
