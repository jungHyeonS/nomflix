import { useQuery} from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult,getTopMovies,getTvShow, getMoviesDetail, IGetMovieDetail, getCredits, IGetCredit,getUpComming, getMoveSimiar } from "../api";
import { makeImagePath } from "../utils";
import { motion,AnimatePresence, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
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
    z-index: 200;
`

const BigMovie = styled(motion.div)`
    position:absolute;
    width:80vh;
    height:80vh;
    background-color: ${props => props.theme.black.lighter};
    left:0;
    right:0;
    border-radius: 15px;
    overflow-y: scroll;
    margin:0 auto;
    z-index: 201;
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
    top: -300px;
    text-align: center;
`
const BigTagLine = styled.h6`
    position: relative;
    font-size: 18px;
    color:${props => props.theme.while.lighter};
    top: -290px;
    text-align: center;
`


const BigOverview = styled.p`
    padding: 20px;
    color:${props => props.theme.while.lighter};
    position: relative;
    top: -60px;
    div{
        padding-top: 20px;
        padding-bottom: 20px;
        span{
            padding-left: 10px;
            padding-right: 10px;
        }
    }
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
const CastList = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4,1fr);
`
const CastItem = styled.div`
    text-align: center;
    align-items: center;
    justify-content: center;
`

const CastImg = styled.div<{photo:string}>`
    width: 80px;
    height: 80px;
    border-radius: 80px;
    background-image: url(${(props) => props.photo});
    background-size: 100%;
    background-position: center;
    margin: 0 auto;
    margin-top: 10px;
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
    const upComming = useQuery<IGetMoviesResult>(["movies","upComming"],getUpComming)
    const topList = top.data;
    const upList = upComming.data;
    
    const detail = useQuery<IGetMovieDetail>(
        ["movies",bigMovieMath?.params.id],
        () => getMoviesDetail(Number(bigMovieMath?.params.id)),
        {enabled:!!bigMovieMath?.params.id}
    )
    const credits = useQuery<IGetCredit>(
        ["movies","getCredis"],
        () => getCredits(Number(bigMovieMath?.params.id)),
        {enabled : !!bigMovieMath?.params.id}
    )

    const slimiar = useQuery(
        ["movies","getSlimiar"],
        () => getMoveSimiar(Number(bigMovieMath?.params.id)),
        {enabled : !!bigMovieMath?.params.id}
    )
    console.log(slimiar)

    const onOverlayClick = () => {
        navigate("/");
    }
    // const clickedMovie = bigMovieMath?.params.id && data?.results.find(movie => movie.id+"" === bigMovieMath.params.id)
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

                    <MovieList>
                        <Category>Up Comming</Category>
                        <Slide data={upList}></Slide>
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
                                    {bigMovieMath?.params.id && 
                                    <>
                                        <BigCover style={{backgroundImage : `
                                        linear-gradient(to top,black,transparent),
                                        url(${makeImagePath(detail.data?.backdrop_path || "","w500")})`}}/>
                                        <BigTitle>{detail.data?.title}</BigTitle>
                                        <BigTagLine>{detail.data?.tagline}</BigTagLine>
                                        <BigOverview>
                                            <div>
                                                <span>러닝 타임 : {detail.data?.runtime}분</span>
                                                <span>언어 : {detail.data?.original_language}</span>
                                                <span>평점 : {detail.data?.vote_average}</span>
                                            </div>
                                            {detail.data?.overview}
                                            <CastList>
                                                {credits.data?.cast.map((item,index)=>(
                                                    index < 4 ? <CastItem>
                                                    {item.name}
                                                    <CastImg photo={makeImagePath(item.profile_path || "","w500")}/>
                                                </CastItem> : null
                                                    
                                                ))}
                                            </CastList>
                                            
                                        </BigOverview>

                                        
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