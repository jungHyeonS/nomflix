import styled from "styled-components"
import { IGetMoviesResult } from "../api"
import { makeImagePath } from "../utils"
import YouTube from "react-youtube"

// 

const BannerCon = styled.div<{bgPhoto:string}>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content:center;
    padding: 60px;
     background-image: linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,1)), url(${(props)=>props.bgPhoto});
     background-size: cover; 
   /* .youtube{
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
   } */
`
// const BannerCover = styled.div`
//     width: 100%;
//     height: 100vh;
//     position: absolute;
//     left: 0;
//     top: 0;
//     z-index: 99;
//     background:  linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0.5));;
// `

const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 20px;
    position: relative;
    z-index: 100;
`

const Overview = styled.p`
    font-size: 26px;
    width: 50%;
    position: relative;
    z-index: 100;
`

interface IBanner{
    data? : IGetMoviesResult
}

function Banner(props : IBanner){
    const opts = {
        height: 700,
        width: window.outerWidth,
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          controls: 0,
          autoplay: 1,
          mute:1,
          showinfo:0,
          modestbranding:1,
          loop:1
        },
    }
    // const src = "https://www.youtube.com/embed/-SFcIUEvNOQ?autoplay=1&mute=1&enablejsapi=1"
    return (
        
        
        // 
        <BannerCon bgPhoto={makeImagePath(props.data?.results[0].backdrop_path || "")}>
                {/* <YouTube videoId="AaEyFSPt-N0" opts={opts} className="youtube"></YouTube> */}
                {/* <BannerCover/> */}
                <Title>{props.data?.results[0].title}</Title>
                <Overview>{props.data?.results[0].overview}</Overview>
        </BannerCon>
    )
}
export default Banner