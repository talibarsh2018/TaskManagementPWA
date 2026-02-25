declare var bootstrap: any;
import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent implements OnInit {
  searchKeyword: string = '';
  tasks: any[] = [];
  taskForm: any = {};
  isEditMode: boolean = false;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (data) => this.tasks = data,
      error: (err) => console.error(err)
    });
  }


  addTask(): void {
    const now = new Date().toISOString();
    const newTask = {
      id: 0,
      title: this.taskForm.title,
      description: this.taskForm.description,
      dueDate: this.taskForm.dueDate,
      status: this.taskForm.status,
      remarks: this.taskForm.remarks,
      createdOn: now,
      lastUpdatedOn: now,
      createdBy: this.taskForm.createdBy,
      lastUpdatedBy: this.taskForm.lastUpdatedBy
    };

    this.taskService.createTask(newTask).subscribe({
      next: res => {
        this.tasks.push(res);
        this.taskForm = {};
      },
      error: err => console.error(err)
    });
  }

  editTask(task: any): void {
    this.taskForm = {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      status: task.status,
      remarks: task.remarks,
      id: task.id,
      createdOn: task.createdOn,
      createdBy: task.createdBy,
      lastUpdatedOn: task.lastUpdatedOn,
      lastUpdatedBy: task.lastUpdatedBy
    };
    this.isEditMode = true;
  }

  updateTask(): void {
    const now = new Date().toISOString();
    const updatedTask = {
      id: this.taskForm.id,
      title: this.taskForm.title,
      description: this.taskForm.description,
      dueDate: this.taskForm.dueDate,
      status: this.taskForm.status,
      remarks: this.taskForm.remarks,
      createdOn: this.taskForm.createdOn,
      createdBy: this.taskForm.createdBy,
      lastUpdatedOn: now,
      lastUpdatedBy: this.taskForm.lastUpdatedBy
    };

    this.taskService.updateTask(updatedTask.id, updatedTask).subscribe({
      next: res => {
        const index = this.tasks.findIndex(t => t.id === res.id);
        if (index > -1) this.tasks[index] = res;
        const modal = bootstrap.Modal.getInstance(
          document.getElementById('taskModal')
        );
        modal.hide();
        this.taskForm = {};
        this.isEditMode = false;
      },
      error: err => console.error(err)
    });
  }

  deleteTask(id: number): void {
    if (!confirm('Are you sure to delete this task?')) return;

    this.taskService.deleteTask(id).subscribe({
      next: () => this.tasks = this.tasks.filter(t => t.id !== id),
      error: err => console.error(err)
    });
  }

  cancelEdit(): void {
    this.taskForm = {};
    this.isEditMode = false;
  }

  search(): void {
    if (!this.searchKeyword.trim()) {
      this.loadTasks();
      return;
    }

    this.taskService.searchTasks(this.searchKeyword).subscribe({
      next: (data) => this.tasks = data,
      error: (err) => console.error(err)
    });
  }

  resetSearch(): void {
    this.searchKeyword = '';
    this.loadTasks();
  }

  openAddModal(): void {
    this.taskForm = {};
    this.isEditMode = false;

    const modalElement = document.getElementById('taskModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
  editTasks(task: any): void {
    this.taskForm = { ...task };
    this.isEditMode = true;

    const modalElement = document.getElementById('taskModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}
