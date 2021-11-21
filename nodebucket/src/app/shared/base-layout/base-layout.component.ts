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
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.css']
})
export class BaseLayoutComponent implements OnInit {

  year: number = Date.now();
  //Variables for isLoggedIn and name
  isLoggedIn: boolean;
  name: string;

  constructor(private cookieService: CookieService, private router: Router) {
    this.isLoggedIn = this.cookieService.get('session_user') ? true : false;
    console.log('isLoggedIn:' + this.isLoggedIn);
   }

  ngOnInit(): void {
    //Gets the user name and logs it to console.
    this.name = sessionStorage.getItem('name');
    console.log('Logged in user name' + this.name);
  }

  //Creating function to signOut user
  signOut() {
    //Delete all cookies
    this.cookieService.deleteAll();
    //Re-route back to the sign in page
    this.router.navigate(['/session/signin']);
  }
}
