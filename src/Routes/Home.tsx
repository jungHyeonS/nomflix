import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult,getTopMovies,getTvShow } from "../api";
import { makeImagePath } from "../utils";
import { motion,AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import Banner from "../Components/Banner";
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


const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    opacity: 0;
`

const BigMovie = styled(motion.div)`
    position:absolute;
    width:80vh;
    height:80vh;
    background-color: ${props => props.theme.black.lighter};
    left:0;
    right:0;
    border-radius: 15px;
    overflow: hidden;
    margin:0 auto;
`

const BigCover = styled.div`
    width: 100%;
    background-size: cover;
    background-position: center center;
    height: 400px;
`
const BigTitle = styled.h3`
    color:${props => props.theme.while.lighter};
    padding: 10px;
    font-size: 28px;
    position: relative;
    top: -60px;
`

const BigOverview = styled.p`
    padding: 20px;
    color:${props => props.theme.while.lighter};
    position: relative;
    top: -60px;
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

const rowVariants = {
    hidden : (back:boolean) => ({
        x : back ? -window.outerWidth - 5 :window.outerWidth+ 5
    }),
    visible : {
        x : 0
    },
    exit : (back:boolean) => (
        {
        x : back? window.outerWidth + 5 : -window.outerWidth - 5
    })
}


function Home(){
    const navigate = useNavigate();
    const bigMovieMath = useMatch("/movies/:id")
    const {scrollY} = useScroll()
    const {data,isLoading} = useQuery<IGetMoviesResult>(["movies","nowPlaying"],getMovies);
    const top = useQuery<IGetMoviesResult>(["movies","topMovies"],getTopMovies)
    const topList = top.data;
    
    const tv = useQuery<IGetMoviesResult>(["movies","topMovies"],getTvShow)
    const onOverlayClick = () => {
        navigate("/");
    }

    const clickedMovie = bigMovieMath?.params.id && data?.results.find(movie => movie.id+"" === bigMovieMath.params.id)
    return (
        <Wrapper style={{height:"200vh"}}>
            {
                isLoading? <Loader>Loading...</Loader> : 
                <>
                    <Banner data={data}></Banner>
                    <MovieList>
                        <Category>Top Movies</Category>
                        <Slide data={topList}></Slide>
                    </MovieList>

                    <MovieList>
                        <Category>Movies</Category>
                        <Slide data={data}></Slide>
                    </MovieList>
                    
                    {/* <Slide data={data}></Slide> */}
                    <AnimatePresence>
                           {bigMovieMath ? (
                             <>
                                <Overlay onClick={onOverlayClick} exit={{opacity:0}} animate={{opacity:1}}/>
                                <BigMovie 
                                layoutId={bigMovieMath.params.id}
                                style={{
                                    top:scrollY.get() + 100
                                }}>
                                    {clickedMovie && 
                                    <>
                                        <BigCover style={{backgroundImage : `
                                        linear-gradient(to top,black,transparent),
                                        url(${makeImagePath(clickedMovie.backdrop_path,"w500")})`}}/>
                                        <BigTitle>{clickedMovie.title}</BigTitle>
                                        <BigOverview>{clickedMovie.overview}</BigOverview>
                                    </>}
                                </BigMovie>
                             </>
                           ) : null}
                    </AnimatePresence>
                </>
            }
        </Wrapper>
    );
}
export default Home