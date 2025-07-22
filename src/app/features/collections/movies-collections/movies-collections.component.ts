import { Component, OnDestroy, OnInit } from '@angular/core';
import { IMovieCollection } from '../../../models/movie-collection';
import { CollectionsService } from '../../../core/services/collections/collections.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-movies-collections',
  standalone: true,
  imports: [
      CommonModule,
      MatButtonModule,
      MatCardModule,
      MatPaginatorModule,
      MatProgressSpinnerModule,
      MatIconModule,
      MatTooltipModule
    ],
  templateUrl: './movies-collections.component.html',
  styleUrls: ['./movies-collections.component.scss']
})

export class MoviesCollectionsComponent implements OnInit, OnDestroy {
  private destroySub$ = new Subject<void>();
  collections: IMovieCollection[] = [];
   
  constructor(
    private collectionsService: CollectionsService, 
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.collectionsService.collections$
      .pipe(takeUntil(this.destroySub$))
      .subscribe(collections => {
        this.collections = collections;
      });
    }

  openCollectionDetails(collection: IMovieCollection): void {
    this.router.navigate(['/collections', collection.id]);
  }

  onCreateNewCollection(): void {
    this.router.navigate(['/collections/create']);
  }

  ngOnDestroy(): void {
    this.destroySub$.next();
    this.destroySub$.complete();
  }

}
