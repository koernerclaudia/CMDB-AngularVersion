import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

// Declaring the api url that will provide data for the client app
const apiUrl = 'https://cmdb-b8f3cd58963f.herokuapp.com/';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  // User Registration
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(catchError(this.handleError));
  }

  // User Login
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(catchError(this.handleError));
  }

  // Get All Users (requires JWT token)
  public getAllUsers(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'users', { headers: new HttpHeaders({ Authorization: 'Bearer ' + token }) })
      .pipe(catchError(this.handleError));
  }

  // Get User by Username
  public getUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'users/' + username, { headers: new HttpHeaders({ Authorization: 'Bearer ' + token }) })
      .pipe(catchError(this.handleError));
  }

  // Update User Information
  public updateUser(username: string, updatedData: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .put(apiUrl + 'users/' + username, updatedData, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(catchError(this.handleError));
  }

  // Delete User by Username
  public deleteUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + 'users/' + username, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(catchError(this.handleError));
  }

  // Add a movie to a user's list of favorites
  public addMovieToFavorites(username: string, MovieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .post(apiUrl + `users/${username}/movies/${MovieID}`, null, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(catchError(this.handleError));
  }

    // Get User's Favorite Movies
    public getUserFavoriteMovies(username: string): Observable<any> {
      const token = localStorage.getItem('token');
      return this.http
        .get(apiUrl + `users/${username}/movies`, {
          headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
        })
        .pipe(catchError(this.handleError));
    }

  // Remove a movie from a user's list of favorites
  public removeMovieFromFavorites(username: string, MovieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + `users/${username}/movies/${MovieID}`, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(catchError(this.handleError));
  }

  // Get All Movies (with optional filters)
  public getAllMovies(genre?: string, actor?: string): Observable<any> {
    const token = localStorage.getItem('token');
    let url = apiUrl + 'movies';
    if (genre || actor) {
      const queryParams = new URLSearchParams();
      if (genre) queryParams.append('genre', genre);
      if (actor) queryParams.append('actor', actor);
      url += '?' + queryParams.toString();
    }
    return this.http
      .get(url, { headers: new HttpHeaders({ Authorization: 'Bearer ' + token }) })
      .pipe(catchError(this.handleError));
  }

  // Get Movie by Title
  public getMovieByTitle(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/' + title, { headers: new HttpHeaders({ Authorization: 'Bearer ' + token }) })
      .pipe(catchError(this.handleError));
  }

  // Get Genre Info by Genre Type
  public getGenreInfo(genreType: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/genres/' + genreType, { headers: new HttpHeaders({ Authorization: 'Bearer ' + token }) })
      .pipe(catchError(this.handleError));
  }

  // Get Director Info by Director Name
  public getDirectorInfo(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/directors/' + directorName, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(catchError(this.handleError));
  }

  // Error handling method
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(`Error Status code ${error.status}, Error body is: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }
}





