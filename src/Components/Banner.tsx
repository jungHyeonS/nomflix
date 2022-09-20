import styled from "styled-components"
import { IGetMoviesResult } from "../api"
import { makeImagePath } from "../utils"

const BannerCon = styled.div<{bgPhoto:string}>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content:center;
    padding: 60px;
    background-image: linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,1)), url(${(props)=>props.bgPhoto});
    background-size: cover;
`

const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 20px;
`

const Overview = styled.p`
    font-size: 26px;
    width: 50%;
`

interface IBanner{
    data? : IGetMoviesResult
}

function Banner(props : IBanner){
    return (
        <BannerCon bgPhoto={makeImagePath(props.data?.results[0].backdrop_path || "")}>
                <Title>{props.data?.results[0].title}</Title>
                <Overview>{props.data?.results[0].overview}</Overview>
        </BannerCon>
    )
}
export default Banner