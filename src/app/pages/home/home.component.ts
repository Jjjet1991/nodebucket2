/*
=====================================================
; Title: Web 450 nodebucket
; Author: Professor Krasso
; Date 21 November 2021
; Modified By: Jourdan Neal
; Description: Deployment, completed project. Tasks can be created by the user
; from there moved between To Do, Doing and Done columns. Tasks can be deleted
; by selecting the trash can icon. Tasks can also be re-arranged within each column.
; Users sign in and the signed in under the profile icon.
=====================================================
*/

import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/shared/interface/employee.interface';
import { Item } from 'src/app/shared/interface/item.interface';
import { TaskService } from 'src/app/task.service';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogueComponent } from 'src/app/shared/task-dialogue/task-dialogue.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //Create employee, todo, done and empId variables.
  employee: Employee;
  todo: Item[];
  done: Item[];
  //Adding 'doing array'
  doing: Item[];
  empId: number;

  constructor( private taskService: TaskService, private cookieService: CookieService, private dialog: MatDialog) {
    this.empId = parseInt(this.cookieService.get('session_user'), 10);
    //Call findAllTasks for requested empId.
    this.taskService.findAllTasks(this.empId).subscribe(res => {
       console.log('--Server response from findAllTasks--');
       console.log(res);
      //Return employee object and log to console.
       this.employee= res;
       console.log('--Employee object--');
       console.log(this.employee);
       //Error handling
    }, err => {
      console.log(err);
    }, ()=> {
      console.log('Inside the complete function of the findAllTasksAPI.');
    //Create todo and done variables for specified empId
    this.todo= this.employee.todo;
    this.done = this.employee.done;
    this.doing = this.employee.doing;

    //Console log todo for empId and done for empId.
    console.log('--Todo tasks--');
    console.log(this.todo);

    console.log('--Done tasks');
    console.log(this.done);

    console.log('--Doing tasks--');
    console.log(this.doing);
    })
   }

  ngOnInit(): void {
  }

  //Open Dialog when Task is created
  openTaskDialogue() {
    const dialogRef = this.dialog.open(TaskDialogueComponent, {
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.taskService.createTask(this.empId, data.text).subscribe(res => {
          this.employee = res;
        }, err => {
          console.log(err);
        }, () => {
          this.todo = this.employee.todo;
          this.done = this.employee.done;
          this.doing = this.employee.doing;
        })
      }
    })
  }

    //Function to updated task lists.
updateTaskList(empId:number, todo:Item[], done:Item[], doing:Item[]): void {
  this.taskService.updateTask(empId, todo, done, doing).subscribe( res => {
    this.employee = res.data;
  }, err => {
    console.log(err)
  }, () => {
    this.todo = this.employee.todo;
    this.done = this.employee.done;
    this.doing = this.employee.doing;
  })
}


  //Event for drag and drop
  drop(event: CdkDragDrop<any[]>) {

    //Move items within a container.
    if(event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      console.log('Reorder list of task items');

      this.updateTaskList(this.empId, this.todo, this.done, this.doing);

      //Move tasks from one container to another.
    } else {
      transferArrayItem( event.previousContainer.data,
                          event.container.data,
                          event.previousIndex,
                           event.currentIndex);

      console.log('Items moved.');

      this.updateTaskList(this.empId, this.todo, this.done, this.doing);
    }
  }

  //Delete Tasks
  deleteTask( taskId: String) {
    //Confirm if the user wants to delete the selected task
    if(confirm('Are you sure you want to delete this task?')) {
      if(taskId) {
        //Logging that task was deleted
        console.log(`Task Id ${taskId} was deleted.`);
        //Subscribe to changes is employee todo and done to return updated todo and done data.
        this.taskService.deleteTask(this.empId, taskId).subscribe(res => {
          this.employee = res.data;
        }, err => {
          console.log(err)
        }, () => {
          this.todo = this.employee.todo;
          this.done = this.employee.done;
          this.doing= this.employee.doing;
        })
      }
    }

  }
}
