import './App.css';
import React from "react";
import Editor from './components/Editor/Editor.js';
import Header from "./components/Header/Header.js";

import rawContent from "./data/rawContent.js";

const App = () => {
  return (
    <div className="App">
      <Header />
      <Editor rawContent={rawContent} />
    </div>
  );
};

export default App;
