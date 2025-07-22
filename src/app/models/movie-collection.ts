import { IMovie } from "./search-movies";

export interface IMovieCollection {
  id: string;
  title: string;
  description: string;
  movies: IMovie[];
}
