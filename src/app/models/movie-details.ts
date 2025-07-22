import { IMovie } from "./search-movies";

export interface IMovieDetails extends IMovie {
    budget: number;
    spoken_languages: { english_name: string, iso_639_1: string; name: string }[];
    revenue: number;
}
