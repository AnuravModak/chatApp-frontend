import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from './Components/WelcomePage';
import ChatPage from './Components/ChatPage';

const App = () => {
  return (

    

      <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
   
  );
};

export default App;

