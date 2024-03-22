import './App.css';
import React, { useState } from "react";
import Editor from './components/Editor/Editor.js';
import Header from "./components/Header";

const App = () => {
  return (
    <div className="App">
      <Header />
      <Editor />
    </div>
  );
};

export default App;
