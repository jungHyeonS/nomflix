const API_KEY = "cec1dbc5f2281d2a147e666dc08b5e0f";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie{
    backdrop_path:string;
    poster_path:string;
    title:string;
    overview:string;
    id:number;
}

export interface IGetMoviesResult {
    dates: {
        maximum: string,
        minimum: string,
    };
    page: number,
    results: IMovie[],
    total_pages: number,
    total_results: number,
}

export function getMovies(){
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=kr`).then((response) => response.json())
}