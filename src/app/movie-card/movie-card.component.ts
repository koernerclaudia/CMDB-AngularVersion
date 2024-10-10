import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog
import { GenreInfoComponent } from '../genre-info/genre-info.component'; // Import the GenreInfoComponent

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];

  constructor(public fetchApiData: FetchApiDataService, public dialog: MatDialog) { } // Inject MatDialog

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  // Function to open Genre Info Dialog
  openGenreDialog(genreType: string): void {
    this.dialog.open(GenreInfoComponent, {
      data: { genreType }  // Pass the genre type to the dialog
    });
  }
}
