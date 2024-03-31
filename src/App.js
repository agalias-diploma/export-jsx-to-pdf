import './App.css';
import React from "react";
import Editor from './components/Editor/Editor.js';
import Header from "./components/Header/Header.js";
import TextEditor from './components/TextEditor.js';

const App = () => {
  return (
    <div className="App">
      <Header />
      <Editor />
    </div>
  );
};

export default App;
