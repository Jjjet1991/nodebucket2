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
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
//import { SignInService } from 'src/app/sign-in.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  //Create variable for with value of FormGroup and variable error with string value.
  form: FormGroup;
  error: string;

  //Reference to imported modules in constructor
  constructor( private router: Router, private cookieService: CookieService,
     private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    //Validating that empID is a numerical value
    this.form = this.fb.group({
      empId: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])]
    })
  }

  //Create login function
  login() : void {
    const empId = this.form.controls['empId'].value;
    //Checks for numerical value entered

    this.http.get('/api/employees/' + empId).subscribe(res =>
      {
        if (res)
        {
          console.log(res);
          sessionStorage.setItem('name', `${res['firstName']} ${res['lastName']}`);
          //If value is entered navigates to HomeComponent
          this.cookieService.set('session_user', empId, 1);
          this.router.navigate(['/']);
        }
        //If nothing entered in empId displays error message that empId is invalid.
        else {
          this.error = 'The employee ID you entered is invalid, please try again';
        }
      })
    }
}
