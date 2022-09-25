import { useQuery } from "react-query";
import { getTopTv, getTvShow, IGetMoviesResult } from "../api";
import styled from "styled-components";
import Banner from "../Components/Banner";
import Slide from "../Components/Slide";
import { useMatch } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
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



function Tv(){
    const tvMacth = useMatch("/tv/:id");
    console.log(tvMacth);
    const {data,isLoading} = useQuery<IGetMoviesResult>(["tvshow","getTvShow"],getTvShow)
    const top = useQuery<IGetMoviesResult>(["tvShow","getLatest"],getTopTv)
    return (
        <>
            <Wrapper style={{height:"200vh"}}>
                {
                    isLoading ? <Loader>Loading...</Loader> :
                    <>
                        <Banner data={data}></Banner>
                        <MovieList>
                            <Category>Popular Tv</Category>
                            <Slide data={data} type="tv"></Slide>
                        </MovieList>

                        <MovieList>
                            <Category>Latest Tv</Category>
                            <Slide data={top.data} type="tv"></Slide>
                        </MovieList>

                        <AnimatePresence>
                            <OverlayVideo bigMovieMath={tvMacth} type="tv"/>
                        </AnimatePresence>
                    </>
                }
            </Wrapper>
        </>
    );
}
export default Tv