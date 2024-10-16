import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavBarComponent implements OnInit {
  constructor(
    public router: Router, // You have to add this line to be able to use 'router'
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  /**
   * Logs the user out of the system and sends them back to the welcome view
   */
  logoutUser(): void {
    localStorage.clear();
    this.router.navigate(['welcome']); // routes to the 'movie-card' view
    this.snackBar.open("You've been logged out", 'OK', {
      duration: 2000,
    });
  }
}