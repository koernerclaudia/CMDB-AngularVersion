// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';


// This is the component that will display the user registration form
// selector defines the custom HTML element, into which this component will render.
// is called Decorator. It is a function that adds metadata to a class, its members, or its method arguments.
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {

  // the @Input decorator that defines the component’s input.
  @Input() userData = { username: '', password: '', email: '', Birthday: '' };

constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar) { }

ngOnInit(): void {
}

//The ngOnInit method is called once the component has received all its inputs 
// (all its data-bound properties) from the calling component—in other words, the real-life user. 
// You define an input, or the user data, using the @input decorator. 
// The userData object will then be passed into the API call in the registerUser function.

// This is the function responsible for sending the form inputs to the backend
registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe((result) => {
  // Logic for a successful user registration goes here! (To be implemented)
  console.log(result);
     this.dialogRef.close(); // This will close the modal on success!
     this.snackBar.open("You are signed up!", 'OK', {
        duration: 3000
     });
    }, (result) => {
      this.snackBar.open("Sign up failed, please try again", 'OK', {
        duration: 3000
      });
    });
  }

  }
