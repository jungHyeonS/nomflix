
import styled from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { IGetMoviesResult } from "../api"
import { makeImagePath } from "../utils"
import { useNavigate } from "react-router-dom"
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

// 
// 
const Box = styled(motion.div)<{bgphoto:string}>`
    background: white;
    height: 200px;
    color:red;
    font-size: 66px;
    background-image: url(${(props)=>props.bgphoto});
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

interface IBanner{
    type:string,
    data? : IGetMoviesResult
}

const offset = 6;

function Slide(props : IBanner){

    const navigate = useNavigate();
    const [index,setIndex] = useState(0);
    const [back,setBack] = useState(false)
    const [isHover,setIsHover] = useState(0);
    const [leaving,setLeaving] = useState(false);
    const toggleLevaing = () => setLeaving(prev => !prev)

    

    const incraseIndex = () => {
        if(props.data){
            if(leaving) return ;
            setBack(false);
            toggleLevaing();
            const totalMovies = props.data.results.length;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => prev === maxIndex ? 0 : prev + 1)
        }
    };

    const unincraseIndex = () => {
        if(props.data){
            if(leaving) return ;
            setBack(true);
            toggleLevaing();
            const totalMovies = props.data.results.length;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => prev === 0 ? maxIndex : prev-1)
        }
    }
    const onBoxClicked = (id:number) => {
        if(props.type == "movie"){
            navigate(`/movies/${id}`)
        }else{
            navigate(`/tv/${id}`)
        }
        
    }
    return (

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

            <AnimatePresence initial={false}
                        custom={back}
                        onExitComplete={toggleLevaing}>
                <Row
                variants={rowVariants} 
                custom={back}
                initial="hidden" 
                animate="visible" 
                transition={{type:"tween",duration:0.5}}
                exit="exit" key={index}
                >
                    {props.data?.results.slice(1).slice(offset*index,offset*index + offset).map((movie) => (
                        <Box 
                        onClick={() => onBoxClicked(movie.id)}
                        key={movie.id} 
                        variants={boxVariants}
                        initial="normal"
                        whileHover="hover"
                        transition={{type:"tween"}}
                        layoutId={movie.id + ""}
                        bgphoto={makeImagePath(movie.backdrop_path,"w500")}
                        >
                            <img/>
                            <Info variants={infoVariants}>
                                <h4>{movie?.name || movie.title}</h4>
                            </Info>
                        </Box>
                    ))}

{/*  */}
                </Row>

            </AnimatePresence>
        </Slider>
    )
}

export default Slide