import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Home from './Routes/Home';
import Tv from './Routes/Tv';
import Search from './Routes/Search';
import Header from './Components/Header';


function App() {
  return (
    <Router>
      <Header></Header>
      <Routes>
        <Route path='/tv' element={<Tv/>}></Route>
        <Route path='/serach' element={<Search/>}></Route>
        <Route path='/' element={<Home/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
