import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IMovieCollection } from '../../../models/movie-collection';
import { IMovie } from '../../../models/search-movies';

const STORAGE_KEY = 'movieCollections';

@Injectable({
  providedIn: 'root',
})
export class CollectionsService {
  private collections: IMovieCollection[] = [];
  private collectionsSubject = new BehaviorSubject<IMovieCollection[]>([]);

  collections$ = this.collectionsSubject.asObservable();

  constructor() {
    this.loadCollections();
  }

  private loadCollections(): void {
    const data = localStorage.getItem(STORAGE_KEY);
    this.collections = data ? JSON.parse(data) : [];
    this.collectionsSubject.next([...this.collections]);
  }

  getCollections(): IMovieCollection[] {
    return [...this.collections];
  }

  getCollectionById(id: string): IMovieCollection | undefined {
    return this.collections.find(c => c.id === id);
  }

  createCollection(title: string, description?: string): void {
    const newCollection: IMovieCollection = {
      id: crypto.randomUUID(),
      title,
      description: description || '',
      movies: [],
    };
    this.collections.push(newCollection);
    this.saveCollections();
  }

  addMovieToCollection(collectionId: string, movie: IMovie): boolean {
    const collection = this.collections.find(c => c.id === collectionId);
    if (!collection) {
      return false;
    }

    const exists = collection.movies.some(m => m.id === movie.id);
    if (exists) {
      return false;
    }

    collection.movies.push(movie);
    this.saveCollections();
    return true;
  }

  removeMovieFromCollection(collectionId: string, movieId: number): void {
    const collection = this.collections.find(c => c.id === collectionId);
    if (collection) {
      collection.movies = collection.movies.filter(m => m.id !== movieId);
      this.saveCollections();
    }
  }

  private saveCollections(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.collections));
    this.collectionsSubject.next([...this.collections]);
  }
}
