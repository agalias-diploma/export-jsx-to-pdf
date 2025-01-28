import './App.css';
import React from 'react';
import Editor from './components/Editor/Editor.js';
import Header from './components/Header/Header.js';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

import rawContent from './data/rawContent.js';

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
      setToken(storedToken);
      setIsLoggedIn(true);
  
      // Optionally fetch user details using the stored token
      axios
        .get('http://localhost:3000/users/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
        .then((response) => setUser(response.data))
        .catch((error) => console.error('Failed to fetch user:', error));
    }
    
    // Check URL for token after OAuth redirect
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      localStorage.setItem('token', urlToken);
      setToken(urlToken);
      setIsLoggedIn(true);
    
      // Optionally fetch user details using the new token
      axios
        .get('http://localhost:3000/users/me', {
          headers: {
            Authorization: `Bearer ${urlToken}`,
          },
        })
        .then((response) => setUser(response.data))
        .catch((error) => console.error('Failed to fetch user:', error));
    
      // Clear the query string to prevent issues
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
        </div>
      ) : (
        <>
          <h1>Welcome, {user?.name || 'User'}</h1>
          <button onClick={handleLogout}>
            Sign Out
          </button>
          <Editor rawContent={rawContent} />
        </>
      )}
    </div>
  );
};

export default App;
