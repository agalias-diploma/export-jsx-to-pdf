import './App.css';
import React, { useState, useEffect } from 'react';
import useAuth from './hooks/useAuth';
import Editor from './components/Editor/Editor';
import Header from './components/Header/Header';
import AuthorizedUser from './components/WhichUser/AuthorizedUser/AuthorizedUser';
import UnauthorizedUser from './components/WhichUser/UnauthorizedUser/UnauthorizedUser';
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import rawContent from './data/rawContent';

const App = () => {
  const { isLoggedIn, user, token, loading, handleLogin, handleLogout } = useAuth();

  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    const savedTemplate = localStorage.getItem('selectedTemplate');
    return savedTemplate ? JSON.parse(savedTemplate) : null;
  });

  useEffect(() => {
    if (selectedTemplate) {
      // If a template is selected, save it to localStorage
      localStorage.setItem('selectedTemplate', JSON.stringify(selectedTemplate));
    }
  }, [selectedTemplate]);

  if (loading) {
    return <LoadingScreen />; // Prevent UI flickering
  }

  return (
    <div className="App">
      <Header />
      {!isLoggedIn ? (
        <>
          <UnauthorizedUser handleLogin={handleLogin} />
          <Editor rawContent={rawContent} />
        </>
      ) : (
        <>
          <AuthorizedUser user={user} token={token} handleLogout={handleLogout} setSelectedTemplate={setSelectedTemplate} />
          <Editor rawContent={rawContent} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} />
        </>
      )}
    </div>
  );
};

export default App;
