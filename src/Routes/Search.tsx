import { useQuery } from "react-query";
import { useLocation, useSearchParams } from "react-router-dom";
import { getSearchMovie, getSearchTv, IGetMoviesResult } from "../api";
import styled from "styled-components";
import Slide from "../Components/Slide";

const Wrapper = styled.div`
    background-color: black;
`

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

const MovieList =  styled.div`
    width: 100%;
    height: 200px;
    margin-top: 200px;
    margin-bottom: 200px;
`

const Category = styled.h2`
    position: relative;
    top: -120px;
    font-size: 28px;
    padding-left: 20px;
`



function Search(){
    const [searchParams,_] = useSearchParams()
    const keyword = searchParams.get("keyword");

    const movie = useQuery<IGetMoviesResult>(["movies","searchMoive"],() => getSearchMovie(keyword || ""));
    const tv = useQuery<IGetMoviesResult>(["tv","getSearchTv"],() => getSearchTv(keyword || ""))
    console.log(movie.data);
    return (
        <>
            <Wrapper style={{height:"200vh"}}>
                {
                    movie.isLoading ? <Loader>Loading...</Loader> :
                    <>
                        <MovieList>
                            <Category>Movie</Category>
                            <Slide data={movie.data} type="movie"></Slide>
                        </MovieList>

                        <MovieList>
                            <Category>Tv</Category>
                            <Slide data={tv.data} type="tv"></Slide>
                        </MovieList>
                    </>
                }
            </Wrapper>
        </>
    );
}
export default Search