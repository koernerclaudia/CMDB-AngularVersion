import { Component, OnInit } from '@angular/core';
import { LoginFormComponent } from '../login-form/login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-welcome-page',
  // templateUrl: './welcome-page.component.html',
  template: `
<div class="main-page">
  <img class="logo" src="../../assets/images/logo.png" alt="CMDB Logo" />
   <h3>Welcome to CMDB</h3>
    <div class="button-container">
      <button
      class="custom-button"
        mat-raised-button
        (click)="openUserRegistrationDialog()"
        
      >
        Sign Up
      </button>
      <button
      class="custom-button"
        mat-raised-button
        (click)="openUserLoginDialog()"
       
      >
        Login
      </button>
    </div>
  </div>`,




  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {
  constructor(public dialog: MatDialog) { }
  ngOnInit(): void {
  }
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px'
    });
  }
openUserLoginDialog(): void {
    this.dialog.open(LoginFormComponent, {
      width: '280px'
    });
  }
}