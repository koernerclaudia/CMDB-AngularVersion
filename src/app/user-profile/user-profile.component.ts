import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // For notifications
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: any = JSON.parse(localStorage.getItem('user') || '{}');
  movies: any[] = []; // Fetched movie list
  favoriteMovies: any[] = [];
  userForm: FormGroup;
  token: string = localStorage.getItem('token') || '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      username: [this.user.username, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      password: [''],
    });
  }

  ngOnInit(): void {
    this.getFavoriteMovies();
    this.updateLocalStorageFavorites
  }

  // Fetch favorite movies from movies array
  getFavoriteMovies() {
    if (!this.user || !this.movies.length) return;
    this.favoriteMovies = this.movies.filter((movie) =>
      this.user.FavoriteMovies.includes(movie._id)
    );
  }

    updateLocalStorageFavorites(): void {
    const updatedUser = { ...this.user, FavoriteMovies: this.favoriteMovies };
    localStorage.setItem('user', JSON.stringify(updatedUser));
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

  // Remove movie from favorites
  removeFavorite(movieId: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    this.http
      .delete(
        `https://cmdb-b8f3cd58963f.herokuapp.com/users/${this.user.username}/movies/${movieId}`,
        { headers }
      )
      .subscribe(
        (response) => {
          this.favoriteMovies = this.favoriteMovies.filter(
            (movie) => movie._id !== movieId
          );
          this.snackBar.open('Movie removed from favorites.', 'Close', {
            duration: 3000,
          });
        },
        (error) => {
          console.error(error);
          this.snackBar.open('Failed to remove movie.', 'Close', {
            duration: 3000,
          });
        }
      );
  }

  // Deregister account
  deleteAccount() {
    if (confirm('Are you sure you want to delete your account?')) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
      });

      this.http
        .delete(
          `https://cmdb-b8f3cd58963f.herokuapp.com/users/${this.user.username}`,
          { headers }
        )
        .subscribe(
          () => {
            localStorage.clear();
            this.snackBar.open('Account deleted successfully.', 'Close', {
              duration: 3000,
            });
            this.router.navigate(['/signup']);
          },
          (error) => {
            console.error(error);
            this.snackBar.open('Failed to delete account. Try again.', 'Close', {
              duration: 3000,
            });
          }
        );
    }
  }
}

// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar'; // For notifications
// import { HttpClient, HttpHeaders } from '@angular/common/http';

// @Component({
//   selector: 'app-user-profile',
//   templateUrl: './user-profile.component.html',
//   styleUrls: ['./user-profile.component.scss'],
// })
// export class UserProfileComponent implements OnInit {
//   user: any = JSON.parse(localStorage.getItem('user') || '{}');
//   movies: any[] = []; // Fetched movie list
//   favoriteMovies: any[] = [];
//   userForm: FormGroup;
//   token: string = localStorage.getItem('token') || '';

//   constructor(
//     private fb: FormBuilder,
//     private http: HttpClient,
//     private snackBar: MatSnackBar,
//     private router: Router
//   ) {
//     this.userForm = this.fb.group({
//       username: [this.user.username, Validators.required],
//       email: [this.user.email, [Validators.required, Validators.email]],
//       password: [''],
//     });
//   }

//   ngOnInit(): void {
//     this.getFavoriteMovies();
//     // this.loadFavoritesFromLocalStorage();
//     // this.getFavoriteMovies();
//   }

//   // // Load user's favorite movies from local storage
//   // loadFavoritesFromLocalStorage(): void {
//   //   const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
//   //   this.favoriteMovies = storedUser.FavoriteMovies || [];
//   // }

//   // Fetch favorite movies from movies array
//   getFavoriteMovies() {
//     if (!this.user || !this.movies.length) return;
//     this.favoriteMovies = this.movies.filter((movie) =>
//       this.user.favoriteMovies.includes(movie._id)
//     );
//   }

//   // Check if a movie is in the user's list of favorite movies
//   isFavorite(movieId: string): boolean {
//     return this.favoriteMovies.includes(movieId);
//   }

//   // Update user profile
//   updateProfile() {
//     const updatedUser: any = {};
//     if (this.userForm.get('username')?.value) {
//       updatedUser.username = this.userForm.get('username')?.value;
//     }
//     if (this.userForm.get('password')?.value) {
//       updatedUser.password = this.userForm.get('password')?.value;
//     }
//     if (this.userForm.get('email')?.value) {
//       updatedUser.email = this.userForm.get('email')?.value;
//     }

//     if (!Object.keys(updatedUser).length) {
//       this.snackBar.open('Please update at least one field.', 'Close', {
//         duration: 3000,
//       });
//       return;
//     }

//     const headers = new HttpHeaders({
//       Authorization: `Bearer ${this.token}`,
//       'Content-Type': 'application/json',
//     });

//     this.http
//       .put(
//         `https://cmdb-b8f3cd58963f.herokuapp.com/users/${this.user.username}`,
//         updatedUser,
//         { headers }
//       )
//       .subscribe(
//         (updatedUser) => {
//           this.user = updatedUser;
//           localStorage.setItem('user', JSON.stringify(this.user));
//           this.snackBar.open('Profile updated successfully!', 'Close', {
//             duration: 3000,
//           });
//         },
//         (error) => {
//           console.error(error);
//           this.snackBar.open('Failed to update profile. Try again.', 'Close', {
//             duration: 3000,
//           });
//         }
//       );
//   }

// // Remove movie from favorites
// removeFavorite(movieId: string) {
//   const headers = new HttpHeaders({
//     Authorization: `Bearer ${this.token}`,
//   });

//   this.http
//     .delete(
//       `https://cmdb-b8f3cd58963f.herokuapp.com/users/${this.user.username}/movies/${movieId}`,
//       { headers }
//     )
//     .subscribe(
//       (response) => {
//         this.favoriteMovies = this.favoriteMovies.filter(
//           (movie) => movie._id !== movieId
//         );
//         this.snackBar.open('Movie removed from favorites.', 'Close', {
//           duration: 3000,
//         });
//       },
//       (error) => {
//         console.error(error);
//         this.snackBar.open('Failed to remove movie.', 'Close', {
//           duration: 3000,
//         });
//       }
//     );
// }




// //   // Remove movie from favorites
// // removeFavorite(movieId: string) {
// //   const headers = new HttpHeaders({
// //     Authorization: `Bearer ${this.token}`,
// //   });

// //   this.http
// //     .delete(
// //       `https://cmdb-b8f3cd58963f.herokuapp.com/users/${this.user.username}/movies/${movieId}`,
// //       { headers }
// //     )
// //     .subscribe(
// //       (response) => {
// //         // Log the response for debugging
// //         console.log('Response from server:', response);

// //         // Check if the response indicates success before updating local state
// //         if (response) {
// //           // Update the local favorite movies list
// //           this.favoriteMovies = this.favoriteMovies.filter(
// //             (movie) => movie._id !== movieId
// //           );
// //           // Optionally, update user object in local storage if needed
// //           const updatedUser = { ...this.user };
// //           updatedUser.FavoriteMovies = updatedUser.FavoriteMovies.filter(
// //             (id: string) => id !== movieId
// //           );
// //           localStorage.setItem('user', JSON.stringify(updatedUser));
// //           this.snackBar.open('Movie removed from favorites.', 'Close', {
// //             duration: 3000,
// //           });
// //         } else {
// //           this.snackBar.open('Failed to remove movie.', 'Close', {
// //             duration: 3000,
// //           });
// //         }
// //       },
// //       (error) => {
// //         console.error('Error removing movie:', error);
// //         this.snackBar.open('Failed to remove movie. Try again.', 'Close', {
// //           duration: 3000,
// //         });
// //       }
// //     );
// // }


//   // Deregister account
//   deleteAccount() {
//     if (confirm('Are you sure you want to delete your account?')) {
//       const headers = new HttpHeaders({
//         Authorization: `Bearer ${this.token}`,
//       });

//       this.http
//         .delete(
//           `https://cmdb-b8f3cd58963f.herokuapp.com/users/${this.user.username}`,
//           { headers }
//         )
//         .subscribe(
//           () => {
//             localStorage.clear();
//             this.snackBar.open('Account deleted successfully.', 'Close', {
//               duration: 3000,
//             });
//             this.router.navigate(['/signup']);
//           },
//           (error) => {
//             console.error(error);
//             this.snackBar.open('Failed to delete account. Try again.', 'Close', {
//               duration: 3000,
//             });
//           }
//         );
//     }
//   }
// }
