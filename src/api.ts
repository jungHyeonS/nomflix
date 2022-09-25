const API_KEY = "cec1dbc5f2281d2a147e666dc08b5e0f";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie{
    backdrop_path:string;
    poster_path:string;
    title:string;
    overview:string;
    id:number;
    name?:string;
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

export interface IGetMovieDetail {
    backdrop_path : string,
    budget:number,
    id:number,
    title:string,
    overview:string,
    popularity:number,
    poster_path:string,
    runtime:number,
    vote_average:number,
    vote_count:number,
    original_language:string,
    tagline:string
    name?:string
}

export interface ICast{
    id: number
    known_for_department: string
    name: string
    profile_path: string
}

export interface IGetCredit{
    cast : ICast[]
}

export function getTopMovies(){
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`).then((response) => response.json())
}

export function getMovies(){
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=kr`).then((response) => response.json())
}

export function getMoviesDetail(id:Number,type:string){
    if(type == "movie"){
        return fetch(`${BASE_PATH}/movie/${id}?api_key=${API_KEY}&language=en-US`).then((response) => response.json())
    }else{
        return fetch(`${BASE_PATH}/tv/${id}?api_key=${API_KEY}&language=en-US`).then((response) => response.json())
    }
    
}

export function getCredits(id:Number,type:string){
    if(type == "moive"){
        return fetch(`${BASE_PATH}/movie/${id}/credits?api_key=${API_KEY}&language=en-US`).then((response) => response.json())
    }else{
        return fetch(`${BASE_PATH}/tv/${id}/credits?api_key=${API_KEY}&language=en-US`).then((response) => response.json())
    }
    
}

export function getUpComming(){
    return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`).then((response) => response.json())
}

export function getTvShow(){
    return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=en-US&page=1`).then((response) => response.json())
}

export function getMovieVideo(id : number){
    return fetch(`${BASE_PATH}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`).then((response) => response.json())
}

export function getMoveSimiar(id : number,type:string){
    if(type == "moive"){
        return fetch(`${BASE_PATH}/movie/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`).then((response) => response.json())
    }else{
        return fetch(`${BASE_PATH}/tv/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`).then((response) => response.json())
    }
}

export function getTopTv(){
    return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=en-US&page=1`).then((response) => response.json())
}

export function getSearchMovie(keyword : string){
    return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=false`).then((response) => response.json())
}

export function getSearchTv(keyword : string){
    return fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=false`).then((response) => response.json())
}