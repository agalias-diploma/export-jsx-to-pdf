import React from 'react';
import ButtonComponent from '../Button/Button';
import './Header.css';

const Header = ({ isLoggedIn, user, handleLogin, handleLogout }) => {
  return (
    <header className="app-header">
      <div className="header-title">
        Export formatted text to PDF
      </div>
      
      <div className="auth-section">
        {isLoggedIn ? (
          <div className="user-info">
            {user?.name && (
              <span className="user-greeting">
                Hello, {user.name}
              </span>
            )}
            <ButtonComponent 
              text="Sign Out"
              color="error"
              onClick={handleLogout}
            />
          </div>
        ) : (
          <ButtonComponent 
            text="Sign In with Google"
            color="success"
            onClick={handleLogin}
          />
        )}
      </div>
    </header>
  );
};

export default Header;