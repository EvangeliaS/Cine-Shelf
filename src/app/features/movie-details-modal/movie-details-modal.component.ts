// // src/app/features/movie-details/movie-details-modal.component.ts
import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { IMovieDetails } from '../../models/movie-details';
import { TmdbService } from '../../core/services/tmdb/tmdb.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-movie-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './movie-details-modal.component.html',
  styleUrls: ['./movie-details-modal.component.scss']
})

export class MovieDetailsModalComponent implements OnInit, OnDestroy {
  movie: IMovieDetails | null = null;
  isLoading = true;
  error: string | null = null;
  userRating = 0;
  hoveredRating = 0;
  isSubmittingRating = false;

  movieId: number;

  constructor(
    private tmdbService: TmdbService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.movieId = +this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.loadMovieDetails();
    document.addEventListener('keydown', this.handleKeyDown);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.close();
    }
  };

  private loadMovieDetails(): void {
    this.isLoading = true;
    this.error = null;

    this.tmdbService.getMovieDetails(this.movieId).subscribe({
      next: (res) => {
        this.movie = res;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.error = 'Failed to load movie details. Please try again.';
        console.error('Error loading movie details:', error);
      }
    });
  }

  getLanguagesList(): string {
    return this.movie?.spoken_languages?.map(lang => lang.english_name || lang.name).join(', ') || 'N/A';
  }

  getImageUrl(path: string | null): string {
    return path ? `https://image.tmdb.org/t/p/w300${path}` : 'assets/no-image.jpg';
  }

  onRateMovie(rating: number): void {
    if (!this.movie?.id || this.isSubmittingRating) return;

    this.isSubmittingRating = true;

    this.tmdbService.getGuestSession().subscribe({
      next: (session) => {
        this.tmdbService.rateMovie(this.movie!.id, session.guest_session_id, rating).subscribe({
          next: () => {
            this.userRating = rating;
            this.isSubmittingRating = false;
            alert('Thank you for rating!');
          },
          error: () => {
            this.isSubmittingRating = false;
            alert('Rating failed. Please try again.');
          }
        });
      },
      error: () => {
        this.isSubmittingRating = false;
        alert('Unable to start guest session.');
      }
    });
  }

  close(): void {
    this.router.navigate([{ outlets: { popup: null } }]);
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
