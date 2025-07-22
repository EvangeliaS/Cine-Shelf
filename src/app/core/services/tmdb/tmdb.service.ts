import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISearchMoviesResponse } from '../../../models/search-movies';
import { IMovieDetails } from '../../../models/movie-details';
import { IGetGuestSessionResponse } from '../../../models/get-guest-session';
import { IAddRating } from '../../../models/add-rating';
import { environment } from '../../environment/environment';

@Injectable({ providedIn: 'root' })
export class TmdbService {
  private readonly baseUrl = 'https://api.themoviedb.org/3';
  private readonly API_KEY = environment.tmdbApiKey;

  constructor(private http: HttpClient) {}

  searchMovies(query: string, page = 1): Observable<ISearchMoviesResponse> {
    return this.http.get<ISearchMoviesResponse>(`${this.baseUrl}/search/movie`, {
      params: {
        api_key: this.API_KEY,
        query,
        page
      }
    });
  }

  getMovieDetails(movieId: number): Observable<IMovieDetails> {
    return this.http.get<IMovieDetails>(`${this.baseUrl}/movie/${movieId}`, {
      params: { api_key: this.API_KEY }
    });
  }

  getGuestSession(): Observable<IGetGuestSessionResponse> {
    return this.http.get<IGetGuestSessionResponse>(`${this.baseUrl}/authentication/guest_session/new`, {
      params: { api_key: this.API_KEY }
    });
  }

  rateMovie(movieId: number, guestSessionId: string, rating: number): Observable<IAddRating> {
    return this.http.post<IAddRating>(`${this.baseUrl}/movie/${movieId}/rating`,
      { value: rating },
      {
        headers: { 'Content-Type': 'application/json' },
        params: {
          api_key: this.API_KEY,
          guest_session_id: guestSessionId
        }
      }
    );
  }

}
