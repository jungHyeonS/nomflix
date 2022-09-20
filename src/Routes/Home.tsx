import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import { motion,AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import Banner from "../Components/Banner";

const Wrapper = styled.div`
    background-color: black;
`

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Slider = styled.div`
    position: relative;
    top: -100px;
`

const ArrowLeft = styled(motion.div)`
    position: absolute;
    left: 0;
    top: 0;
    width: 50px;
    height: 200px;
    background: rgba(0,0,0,0.7);
    z-index: 80;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 1s ease-in-out;
`

const ArrowRight = styled(motion.div)`
    position: absolute;
    right: 0;
    top: 0;
    width: 50px;
    height: 200px;
    background: rgba(0,0,0,0.7);
    z-index: 80;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 1s ease-in-out;
`

const Row = styled(motion.div)`
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(6,1fr);
    position: absolute;
    width: 100%;
`

const Box = styled(motion.div)<{bgPhoto:string}>`
    background: white;
    height: 200px;
    color:red;
    font-size: 66px;
    background-image: url(${props => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    cursor: pointer;
    &:first-child{
        transform-origin: center left;
    }
    &:last-child{
        transform-origin: center right;
    }
    
`

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    opacity: 0;
`

const Info = styled(motion.div)`
    padding: 10px;
    background-color: ${props => props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    h4{
        text-align: center;
        font-size: 16px;
        color:white
    }
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

const boxVariants = {
    normal : {
        scale:1,
    },
    hover : {
        scale:1.3,
        y:-50,
        zIndex:99,
        transition:{
            delay:0.5,
            duration:0.3,
            type:"tween"
        }
    }
}



const infoVariants = {
    hover : {
        opacity : 1,
        transition:{
            delay : 0.5,
            duration:0.3,
            type:"tween"
        }
    }
}

const arrowVariants = {
    hidden : {
        opacity : 0,   
    },
    visible:{
        opacity : 1, 
        transition:{
            duration : 0.1,
            type:"tween"
        } 
    },
    exit:{
        opacity : 0,  
        transition:{
            duration : 0.1,
            type:"tween"
        }  
    }
}

const offset = 6;

function Home(){
    const navigate = useNavigate();
    const bigMovieMath = useMatch("/movies/:id")
    const {scrollY} = useScroll()
    const {data,isLoading} = useQuery<IGetMoviesResult>(["movies","nowPlaying"],getMovies);
    

    const [index,setIndex] = useState(0);
    const [back,setBack] = useState(false)
    const [isHover,setIsHover] = useState(0);
    const incraseIndex = () => {
        if(data){
            if(leaving) return ;
            setBack(false);
            toggleLevaing();
            const totalMovies = data.results.length;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => prev === maxIndex ? 0 : prev + 1)
        }
        
    };
    const unincraseIndex = () => {
        if(data){
            if(leaving) return ;
            setBack(true);
            toggleLevaing();
            setIndex((prev) => prev -1)
            console.log("unincrease");
        }
    }
    


    const [leaving,setLeaving] = useState(false);
    const toggleLevaing = () => setLeaving(prev => !prev)
    const onBoxCliced = (movieId:number) => {
        navigate(`/movies/${movieId}`)
    }
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
                    <Slider onMouseOver={() => setIsHover(1)} onMouseOut={() => setIsHover(0)}>
                        {isHover ? (
                            <>
                                <ArrowLeft 
                                variants={arrowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                onClick={unincraseIndex}>&lt;</ArrowLeft>
                                <ArrowRight 
                                variants={arrowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                onClick={incraseIndex}>&gt;</ArrowRight>
                            </>
                        ) : null}
                        
                        
                        <AnimatePresence 
                        initial={false}
                        custom={back}
                        onExitComplete={toggleLevaing}>
                            <Row 
                            variants={rowVariants} 
                            custom={back}
                            initial="hidden" 
                            animate="visible" 
                            transition={{type:"tween",duration:0.5}}
                            exit="exit" key={index}>
                                {data?.results.slice(1).slice(offset*index,offset*index + offset).map((movie) => (
                                    <Box 
                                    onClick={() => onBoxCliced(movie.id)}
                                    key={movie.id} 
                                    variants={boxVariants}
                                    initial="normal"
                                    whileHover="hover"
                                    transition={{type:"tween"}}
                                    layoutId={movie.id + ""}
                                    bgPhoto={makeImagePath(movie.backdrop_path,"w500")}>
                                        <img/>
                                        <Info variants={infoVariants}>
                                            <h4>{movie.title}</h4>
                                        </Info>
                                    </Box>
                                ))}
                            </Row>
                        </AnimatePresence>
                    </Slider>
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