import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, switchMap, take, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IMovie, ISearchMoviesResponse } from '../../models/search-movies';
import { TmdbService } from '../../core/services/tmdb/tmdb.service';
import { AddToCollectionModalComponent } from '../collections/add-to-collection-modal/add-to-collection-modal.component';
import { AlphanumericValidatorDirective } from '../../directives/alphanumeric-validator/alphanumeric-validator.directive';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule,
    AlphanumericValidatorDirective,
    MatCheckboxModule,
    MatTooltipModule,
    RouterModule,
  ],
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl('');
  movies: IMovie[] = [];
  currentPage = 1;
  totalResults = 0;
  isLoading = false;
  selectedMovies: IMovie[] = [];
  private destroy$ = new Subject<void>;

  constructor(
    private tmdbService: TmdbService, 
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit() {
    this.setupSearch();
    this.selectedMovies = [];
  }

  private setupSearch() {
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter((query): query is string => {
        return this.searchControl.valid && query != null && query.length >= 3;
      }),
      switchMap(query => {
        if (!query) {
          this.movies = [];
          this.totalResults = 0;
          this.isLoading = false;
          return [];
        }
        this.isLoading = true;
        this.currentPage = 1;
        return this.tmdbService.searchMovies(query!, 1);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: ISearchMoviesResponse) => {
        this.movies = res.results.sort((a, b) => b.popularity - a.popularity);
        this.totalResults = res.total_results;
        this.isLoading = false;
      },
      error: () => {
        this.movies = [];
        this.totalResults = 0;
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent) {
    const query = this.searchControl.value;
    if (this.searchControl.valid && query != null && query.length >= 3) {
      this.currentPage = event.pageIndex + 1;
      this.isLoading = true;

      this.tmdbService.searchMovies(query, this.currentPage).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          this.movies = res.results.sort((a, b) => b.popularity - a.popularity);
          this.totalResults = res.total_results;
          this.isLoading = false;
        },
        error: () => {
          this.movies = [];
          this.isLoading = false;
        }
      });
    }
  }

  getImageUrl(posterPath: string | null): string {
    return posterPath
      ? `https://image.tmdb.org/t/p/w200${posterPath}`
      : 'assets/no-poster.jpg';
  }

  onCollections(): void {
    this.router.navigate(['/collections']);
  }

  openMovieDetails(movie: IMovie): void {
    this.router.navigate([{ outlets: { popup: ['movie', movie.id] } }]);
  }

  toggleSelection(movie: IMovie, checked: boolean): void {
    if (checked) {
      this.selectedMovies.push(movie);
    } else {
      this.selectedMovies = this.selectedMovies.filter(m => m.id !== movie.id);
    }
  }

  isSelected(movie: IMovie): boolean {
    return this.selectedMovies.some(m => m.id === movie.id);
  }

  openAddToCollectionModal(): void {
    if (this.selectedMovies.length === 0) return;
    
    const dialogRef = this.dialog.open(AddToCollectionModalComponent, {
      data: { movies: this.selectedMovies },
      disableClose: false
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result?.success) {
        this.selectedMovies = [];
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}