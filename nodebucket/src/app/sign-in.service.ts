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

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignInService {
  //Create variable empId, which will be array of numbers
  empId: Array<number>;
  constructor() {
    //Assign employee Id predetermined values
    this.empId= [1007, 1008, 1009, 1010, 1011, 1012];
   }
   //Create new function validate takes in empId number
   validate(empId:number){
     //Looking that empId matches one of the predetermined values.
     return this.empId.some(id => id === empId);
   }
}
