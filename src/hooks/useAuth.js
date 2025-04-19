import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

import config from '../config';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');

      if (storedToken) {
        try {
          const decodedToken = jwtDecode(storedToken);
          if (decodedToken.exp * 1000 > Date.now()) {
            setToken(storedToken);
            setIsLoggedIn(true);
            setUser({ name: decodedToken.user.email });
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error('Invalid token:', error);
          handleLogout();
        }
      }

      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('token');

      if (urlToken) {
        localStorage.setItem('token', urlToken);
        setToken(urlToken);
        setIsLoggedIn(true);
        setUser({ name: jwtDecode(urlToken).user.email });
        window.history.replaceState({}, document.title, '/');
      }

      setLoading(false); // Done checking auth
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    // window.location.href = 'http://13.61.142.134:3000/auth';
    window.location.href = `${config.apiUrl}/auth`;
    //window.location.href = 'https://api-stage.agalias-project.online/auth';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    setLoading(false);
  };

  return { isLoggedIn, user, token, loading, handleLogin, handleLogout };
};

export default useAuth;
