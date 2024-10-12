import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // For notifications
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FetchApiDataService } from '../fetch-api-data.service'; // Import your FetchApiDataService

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: any = JSON.parse(localStorage.getItem('user') || '{}');
  favoriteMovies: any[] = [];
  userForm: FormGroup;
  token: string = '';
  movies: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private fetchApiData: FetchApiDataService // Inject your service here
  ) {
    this.userForm = this.fb.group({
      username: [this.user.username, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      password: [''],
    });
  }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.userForm.patchValue({
        username: this.user.username,
        email: this.user.email,
      });
    }
    this.token = localStorage.getItem('token') || '';
    this.getFavoriteMovies();
  }

  getFavoriteMovies(): void {
    this.fetchApiData.getUserFavoriteMovies(this.user.username).subscribe(
      (resp: any) => {
        console.log('Favorite Movies:', resp); // Log the response
        this.favoriteMovies = resp;
      },
      (error: any) => {
        console.error('Error fetching favorite movies:', error);
      }
    );
  }


  // Update user profile
  updateProfile() {
    const updatedUser: any = {};
    if (this.userForm.get('username')?.value) {
      updatedUser.username = this.userForm.get('username')?.value;
    }
    if (this.userForm.get('password')?.value) {
      updatedUser.password = this.userForm.get('password')?.value;
    }
    if (this.userForm.get('email')?.value) {
      updatedUser.email = this.userForm.get('email')?.value;
    }

    if (!Object.keys(updatedUser).length) {
      this.snackBar.open('Please update at least one field.', 'Close', {
        duration: 3000,
      });
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    this.http
      .put(
        `https://cmdb-b8f3cd58963f.herokuapp.com/users/${this.user.username}`,
        updatedUser,
        { headers }
      )
      .subscribe(
        (updatedUser) => {
          this.user = updatedUser;
          localStorage.setItem('user', JSON.stringify(this.user));
          this.snackBar.open('Profile updated successfully!', 'Close', {
            duration: 3000,
          });
        },
        (error) => {
          console.error(error);
          this.snackBar.open('Failed to update profile. Try again.', 'Close', {
            duration: 3000,
          });
        }
      );
  }

  // deleteAccount(username: string, token: string): void {
  //   if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
  //     this.fetchApiData.deleteUser(username, token).subscribe(
  //       response => {
  //         alert("Account deleted successfully.");
  //         this.handleLogout();
  //         window.location.href = "/signup";
  //       },
  //       error => {
  //         console.error("Error:", error);
  //         alert("An error occurred. Please try again.");
  //       }
  //     );
  //   }
  // }

  // handleLogout(): void {
  //   // Implement logout logic here
  // }
}

   // Method to delete user account
//    deleteAccount(): void {
//     this.fetchApiData.deleteUser(this.user.username).subscribe(
//       (resp: any) => {
//         console.log('Account deleted:', resp);
//         localStorage.clear();
//         this.snackBar.open('Account deleted successfully.', 'Close', {
//           duration: 3000,
//         });
//         this.router.navigate(['/welcome']);
//       },
//       (error: any) => {
//         console.error('Error deleting account:', error);
//         this.snackBar.open('Failed to delete account. Try again.', 'Close', {
//           duration: 3000,
//         });
//       }
//     );
// }
// }
