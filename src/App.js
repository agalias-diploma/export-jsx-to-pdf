import './App.css';
import React from 'react';
import useAuth from './hooks/useAuth';
import Editor from './components/Editor/Editor';
import Header from './components/Header/Header';
import LoggedInUser from './components/LoggedInUser/LoggedInUser';
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";

import rawContent from './data/rawContent';

const App = () => {
  const { isLoggedIn, user, token, loading, handleLogin, handleLogout } = useAuth();

  if (loading) {
    return <LoadingScreen />; // Prevent UI flickering
  }

  return (
    <div className="App">
      <Header />
      {!isLoggedIn ? (
        <div>
          <button onClick={handleLogin}>Sign In with Google</button>
          <Editor rawContent={rawContent} />
        </div>
      ) : (
        <>
          <LoggedInUser user={user} token={token} handleLogout={handleLogout} />
          <Editor rawContent={rawContent} />
        </>
      )}
    </div>
  );
};

export default App;
