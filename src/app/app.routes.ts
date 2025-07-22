import { Routes } from '@angular/router';
import { SearchComponent } from './features/search/search-page.component';

export const routes: Routes = [
  {
    path: '',
    component: SearchComponent
  },
  {
    path: 'movie/:id',
    outlet: 'popup',
    loadComponent: () => import('./features/movie-details-modal/movie-details-modal.component').then(m => m.MovieDetailsModalComponent)
  },
  {
    path: 'collections/create',
    loadComponent: () => import('./features/collections/create-collection/create-collection.component').then(m => m.CreateCollectionComponent)
  },
  {
    path: 'collections',
    loadComponent: () => import('./features/collections/movies-collections/movies-collections.component').then(m => m.MoviesCollectionsComponent)
  },
  {
    path: 'collections/:id',
    loadComponent: () => import('./features/collections/collection-details/collection-details.component').then(m => m.CollectionDetailsComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
