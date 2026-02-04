// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
//  //import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css"; // <--- YE LINE ADD KARO (Tailwind yahi se load hoga)
import ToastProvider from "./components/ToastProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <>
      <App />
      <ToastProvider />
    </>
  </BrowserRouter>
);