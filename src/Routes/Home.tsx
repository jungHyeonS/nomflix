import { useQuery} from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult,getTopMovies,getTvShow, getMoviesDetail, IGetMovieDetail, getCredits, IGetCredit,getUpComming, getMoveSimiar } from "../api";
import { makeImagePath } from "../utils";
import { motion,AnimatePresence, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import Banner from "../Components/Banner";
import Slide from "../Components/Slide";
import OverlayVideo from "../Components/OverlayVideo";

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



function Home(){
    
    const bigMovieMath = useMatch("/movies/:id")
    const {scrollY} = useScroll()
    const {data,isLoading} = useQuery<IGetMoviesResult>(["movies","nowPlaying"],getMovies);
    const top = useQuery<IGetMoviesResult>(["movies","topMovies"],getTopMovies)
    const upComming = useQuery<IGetMoviesResult>(["movies","upComming"],getUpComming)
    const topList = top.data;
    const upList = upComming.data;
    
   
    // const clickedMovie = bigMovieMath?.params.id && data?.results.find(movie => movie.id+"" === bigMovieMath.params.id)
    return (
        <Wrapper style={{height:"200vh"}}>
            {
                isLoading? <Loader>Loading...</Loader> : 
                <>
                    <Banner data={data}></Banner>
                    <MovieList>
                        <Category>Top Movies</Category>
                        <Slide data={topList} type="movie"></Slide>
                    </MovieList>

                    <MovieList>
                        <Category>Movies</Category>
                        <Slide data={data} type="moive"></Slide>
                    </MovieList>

                    <MovieList>
                        <Category>Up Comming</Category>
                        <Slide data={upList} type="movie"></Slide>
                    </MovieList>
                    
                    {/* <Slide data={data}></Slide> */}
                    <AnimatePresence>

                            <OverlayVideo bigMovieMath={bigMovieMath} type="movie"></OverlayVideo>
                           
                    </AnimatePresence>
                </>
            }
        </Wrapper>
    );
}
export default Home