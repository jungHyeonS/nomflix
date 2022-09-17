import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { RecoilRoot } from 'recoil';
import {theme} from "./theme"
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const GlobalStyle = createGlobalStyle`
`

root.render(
  <RecoilRoot>
    <ThemeProvider theme={theme}> 
      <GlobalStyle/>
      <App />
    </ThemeProvider>
  </RecoilRoot>
    
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
