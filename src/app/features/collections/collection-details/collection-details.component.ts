import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Add Router
import { CollectionsService } from '../../../core/services/collections/collections.service';
import { IMovieCollection } from '../../../models/movie-collection';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-collection-details',
  standalone: true,
  imports: [ 
    MatCardModule, 
    CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTooltipModule 
  ],
  templateUrl: './collection-details.component.html',
  styleUrls: ['./collection-details.component.scss']
})
export class CollectionDetailsComponent implements OnInit {
  collection: IMovieCollection | null = null;
  notFound: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private collectionsService: CollectionsService,
    private router: Router // Add Router, remove MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    id ? (this.collection = this.collectionsService.getCollectionById(id) ?? null) : (this.notFound = true);
  }

  openMovieDetails(movieId: number): void {
    this.router.navigate([{ outlets: { popup: ['movie', movieId] } }]);
  }

  removeMovie(movieId: number, event: Event): void {
    event.stopPropagation();
    if (this.collection) {
      this.collectionsService.removeMovieFromCollection(this.collection.id, movieId);
      this.collection = this.collectionsService.getCollectionById(this.collection.id) ?? null;
    }
  }
}