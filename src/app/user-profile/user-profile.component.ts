import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // For notifications
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: any = JSON.parse(localStorage.getItem('user') || '{}');
  movies: any[] = []; // Fetched movie list
  FavoriteMovies: any[] = [];
  userForm: FormGroup;
  username: string = '';
  token: string = localStorage.getItem('token') || '';

  constructor(
    public fetchApiData: FetchApiDataService, 
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
    this.getMovies();
    this.loadUserFavorites(); // Load user's favorite movies

    // this.getUserFavoriteMovies();
    // this.updateLocalStorageFavorites();
  }

  

   // Fetch all movies
   getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp; // Store all movies
      console.log('All Movies:', this.movies); // Debugging log
    });
  }

  // Load user's favorite movies from the API
  loadUserFavorites(): void {
    if (this.user.username) {
      this.fetchApiData.getUserFavoriteMovies(this.user.username).subscribe((resp: any) => {
        this.FavoriteMovies = resp; // Assuming response is an array of movie IDs
        console.log('User Favorite Movies:', this.FavoriteMovies); // Debugging log
        this.filterFavoriteMovies(); // Filter movies based on favorites
      });
    }
  }

  // Filter movies to display only the user's favorites
  filterFavoriteMovies(): void {
    this.FavoriteMovies = this.movies.filter(movie => 
      this.FavoriteMovies.includes(movie._id)
    );
  }



  //   updateLocalStorageFavorites(): void {
  //   const updatedUser = { ...this.user, FavoriteMovies: this.FavoriteMovies };
  //   localStorage.setItem('user', JSON.stringify(updatedUser));
  // }

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
          this.FavoriteMovies = this.FavoriteMovies.filter(
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
