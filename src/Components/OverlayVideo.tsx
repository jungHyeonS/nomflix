
import styled from "styled-components";
import { motion ,useScroll} from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery} from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import { getMovies, IGetMoviesResult,getTopMovies,getTvShow, getMoviesDetail, IGetMovieDetail, getCredits, IGetCredit,getUpComming, getMoveSimiar } from "../api";
import { makeImagePath } from "../utils";
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

const SlimiarList = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2,1fr);
    justify-content: center;
    text-align: center;
    align-items: center;
`

const SlimiarItem = styled.div<{photo:string}>`
    width: 260px;
    height: 80px;
    border-radius: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    background-image: url(${(props) => props.photo});
    background-size: 100%;
    background-position: center;
    position: relative;
    cursor: pointer;
`

const SlimiarCover = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
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

interface IProps{
    type?:string,
    bigMovieMath:any
}

function OverlayVideo(props : IProps){
    const navigate = useNavigate();
    const {scrollY} = useScroll()
    const detail = useQuery<IGetMovieDetail>(
        ["movies",props.bigMovieMath?.params.id],
        () => getMoviesDetail(Number(props.bigMovieMath?.params.id),props.type || ""),
        {enabled:!!props.bigMovieMath?.params.id}
    )
    const credits = useQuery<IGetCredit>(
        ["movies","getCredis"],
        () => getCredits(Number(props.bigMovieMath?.params.id),props.type || ""),
        {enabled : !!props.bigMovieMath?.params.id}
    )

    const slimiar = useQuery<IGetMoviesResult>(
        ["movies","getSlimiar"],
        () => getMoveSimiar(Number(props.bigMovieMath?.params.id),props.type || ""),
        {enabled : !!props.bigMovieMath?.params.id}
    )


    const onOverlayClick = () => {
        if(props.type == "tv"){
            navigate("/tv");
        }else{
            navigate("/");
        }
        
    }
    const onSlimarClick = (movieId:number) => {
        if(props.type == "tv"){
            navigate(`/tv/${movieId}`)
        }else{
            navigate(`/movies/${movieId}`)
        }
        
    }

    return (
        <>
            {props.bigMovieMath ? (
                <>
                <Overlay onClick={onOverlayClick} exit={{opacity:0}} animate={{opacity:1}}/>
                <BigMovie 
                layoutId={props.bigMovieMath.params.id}
                style={{
                    top:scrollY.get() + 100
                }}>
                    {props.bigMovieMath?.params.id && 
                    <>
                        <BigCover style={{backgroundImage : `
                        linear-gradient(to top,black,transparent),
                        url(${makeImagePath(detail.data?.backdrop_path || "","w500")})`}}/>
                        <BigTitle>{detail.data?.name || detail.data?.title}</BigTitle>
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
                                    index < 4 ? <CastItem key={index + "cast"}>
                                    {item.name}
                                    <CastImg photo={makeImagePath(item.profile_path || "","w500")}/>
                                </CastItem> : null
                                    
                                ))}
                            </CastList>
                            <SlimiarList>
                                {slimiar.data?.results.map((item,index)=>(
                                    <SlimiarItem key={index+"slimiar"} photo={makeImagePath(item.backdrop_path || "")} onClick={() => onSlimarClick(item.id)}>
                                        <SlimiarCover>
                                            <p>{item.name || item.title}</p>
                                        </SlimiarCover>
                                    </SlimiarItem>
                                ))}
                            </SlimiarList>
                        </BigOverview>

                        
                    </>}
                </BigMovie>
                </>
            ) : null}
        </>

    );
}

export default OverlayVideo;