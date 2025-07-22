import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CollectionsService } from '../../../core/services/collections/collections.service';
import { IMovie } from '../../../models/search-movies';
import { IMovieCollection } from '../../../models/movie-collection';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateCollectionComponent } from '../create-collection/create-collection.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-to-collection-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './add-to-collection-modal.component.html',
  styleUrls: ['./add-to-collection-modal.component.scss']
})

export class AddToCollectionModalComponent implements OnInit, OnDestroy {
  collections: IMovieCollection[] = [];
   private destroySub$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { movies: IMovie[] },
    private dialogRef: MatDialogRef<AddToCollectionModalComponent>,
    private collectionsService: CollectionsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
      this.collectionsService.collections$
        .pipe(takeUntil(this.destroySub$))
        .subscribe(collections => {
          this.collections = collections;
        });
    }

  getMoviePoster(movie: IMovie): string {
    return movie.poster_path
      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
      : 'assets/no-poster.jpg';
  }

  addToCollectionImmediately(collectionId: string): void {
    const collection = this.collections.find(c => c.id === collectionId);
    if (!collection) return;

    this.data.movies.forEach(movie => {
      this.collectionsService.addMovieToCollection(collectionId, movie);
    });

    const movieText = this.data.movies.length === 1 ? 'movie' : 'movies';
    this.snackBar.open(
      `Added ${this.data.movies.length} ${movieText} to "${collection.title}"`,
      'Close',
      { duration: 3000 }
    );

    this.dialogRef.close({ 
      success: true, 
      collectionId: collectionId,
      collectionName: collection.title,
      moviesAdded: this.data.movies.length
    });
  }

  createNewCollectionInDialog(): void {
  const createDialogRef = this.dialog.open(CreateCollectionComponent, {
    maxWidth: '90vw',
    maxHeight: '85vh',
    disableClose: false,
    panelClass: 'create-collection-modal-dialog',
    autoFocus: false,
    restoreFocus: true
  });

  createDialogRef.afterClosed().subscribe(result => {
    if (result?.success) {
      this.snackBar.open('Collection created successfully!', 'Close', { 
        duration: 3000 
      });
    }
  });
}

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroySub$.next();
    this.destroySub$.complete();
  }
}