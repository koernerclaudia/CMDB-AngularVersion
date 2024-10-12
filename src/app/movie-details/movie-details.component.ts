import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent {
  movie: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { Title: string; Description: string },  // Receive title and description
    public dialogRef: MatDialogRef<MovieDetailsComponent>
  ) {
    console.log('Dialog Data:', data); // Log the data to the console
  }
  
  // Function to close the dialog
  closeDialog(): void {
    this.dialogRef.close()
  }
}