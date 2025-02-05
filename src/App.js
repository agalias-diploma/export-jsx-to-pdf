import './App.css';
import React from 'react';
import Editor from './components/Editor/Editor.js';
import Header from './components/Header/Header.js';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import rawContent from './data/rawContent.js';
import ButtonComponent from './components/Button/Button.js';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = () => {
    // Redirect to the backend's /auth endpoint to start Google OAuth
    window.location.href = 'http://localhost:3000/auth';
  };

  useEffect(() => {
    // Attempt to retrieve token from localStorage on app start
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      try {
        // Decode token without sending request
        const decodedToken = jwtDecode(storedToken);
  
        // Check expiration
        if (decodedToken.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setIsLoggedIn(true);
          setUser({ name: decodedToken.user.email }); // Set user without backend request
        } else {
          console.log("Token expired, logging out...");
          handleLogout();
        }
      } catch (error) {
        console.error("Invalid token:", error);
        handleLogout();
      }
    }
    
    // Check URL for token after OAuth redirect
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    
    if (urlToken) {
      localStorage.setItem('token', urlToken);
      setToken(urlToken);
      setIsLoggedIn(true);
      setUser({ name: jwtDecode(urlToken).user.email });

      // Clear query params from URL
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <Header />
      {!isLoggedIn ? (
        <div>
          <button onClick={handleLogin}>
            Sign In with Google
          </button>
          <Editor rawContent={rawContent} />
        </div>
      ) : (
        <>
          <h1>Welcome, {user?.name || 'User'}</h1>
          <button onClick={handleLogout}>
            Sign Out
          </button>
          <Editor rawContent={rawContent} />
          <ButtonComponent 
            text="S3 bucket"
          />
        </>
      )}
    </div>
  );
};

export default App;
