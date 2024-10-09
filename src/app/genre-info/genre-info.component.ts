import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';  // Import the service
import { MatDialogRef } from '@angular/material/dialog'; // If you are using Angular Material dialogs

@Component({
  selector: 'app-genre-info',
  templateUrl: './genre-info.component.html',
  styleUrls: ['./genre-info.component.scss']
})
export class GenreInfoComponent implements OnInit {
  @Input() genreType: string = '';  // Genre type will be passed as input
  genre: any = null;

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<GenreInfoComponent> // Optional: If using dialog
  ) {}

  ngOnInit(): void {
    this.getGenreInfo();
  }

  // Function to fetch genre information
  getGenreInfo(): void {
    this.fetchApiData.getGenre(this.genreType).subscribe((resp: any) => {
      this.genre = resp;
    }, (err: any) => {
      console.error(err);
    });
  }

  // Close the dialog
  closeDialog(): void {
    this.dialogRef.close();
  }
}
