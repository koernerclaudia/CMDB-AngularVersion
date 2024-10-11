import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog
import { GenreInfoComponent } from '../genre-info/genre-info.component'; // Import the GenreInfoComponent
import { DirectorInfoComponent } from '../director-info/director-info.component'; // Import the GenreInfoComponent
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favoriteMovies: string[] = []; // Store user's favorite movies
  user: any = JSON.parse(localStorage.getItem('user') || '{}');

  constructor(
    public fetchApiData: FetchApiDataService, 
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getMovies();
    this.loadFavoritesFromLocalStorage(); // Load favorites from local storage
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  // Load user's favorite movies from local storage
  loadFavoritesFromLocalStorage(): void {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.favoriteMovies = storedUser.FavoriteMovies || [];
  }

  // Check if a movie is in the user's list of favorite movies
  isFavorite(movieId: string): boolean {
    return this.favoriteMovies.includes(movieId);
  }

  // Add a movie to the user's favorites
  addToFavorites(movieId: string): void {
    this.fetchApiData.addMovieToFavorites(this.user.username, movieId).subscribe((response: any) => {
      this.favoriteMovies.push(movieId);
      // this.updateLocalStorageFavorites(); // Update local storage
    });
  }

  // Remove a movie from the user's favorites
  removeFromFavorites(movieId: string): void {
    this.fetchApiData.removeMovieFromFavorites(this.user.username, movieId).subscribe((response: any) => {
      const index = this.favoriteMovies.indexOf(movieId);
      if (index > -1) {
        this.favoriteMovies.splice(index, 1);
      }
      // this.updateLocalStorageFavorites(); // Update local storage
    });
  }

  // Toggle favorite status of a movie
  toggleFavorite(movieId: string): void {
    if (this.isFavorite(movieId)) {
      this.removeFromFavorites(movieId);
    } else {
      this.addToFavorites(movieId);
    }
  }

  // Function to open Genre Info Dialog
  openGenreDialog(genre: any): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        Name: genre.Type,         // Pass the genre name
        Description: genre.Description  // Pass the genre description
      },
      width: '500px'
    });
  }

  openDirectorDialog(Director: any): void {
    this.dialog.open(DirectorInfoComponent, {
      data: {
        Name: Director.Name,         
        Birthyear: Director.Birthyear
      },
      width: '500px'
    });
  }

  openSynopsisDialog(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        Description:movie.Description        
      },
      width: '500px'
    });
  }


}
