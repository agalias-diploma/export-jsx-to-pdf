import './App.css';
import React, { useState } from "react";
import { PDFViewer } from '@react-pdf/renderer';
import FileToSave from './components/FileToSave';
import Editor from './components/Editor/Editor.js';
import ToggleButton from "./components/ToggleButton";
import Header from "./components/Header";

const App = () => {
  const [editorContent, setEditorContent] = useState(null);
  const [isViewerVisible, setIsViewerVisible] = useState(false);

  const handleContentChange = (content) => {
    setEditorContent(content);
  };

  const toggleViewerVisibility = () => {
    setIsViewerVisible(!isViewerVisible);
  };

  return (
    <div className="App">
      <Header />
      <Editor onContentChange={handleContentChange} />
      {/* <ToggleButton
        onClick={toggleViewerVisibility}
        isViewerVisible={isViewerVisible}
      />
      {isViewerVisible && (
        <PDFViewer style={{ width: "100%", height: "100vh" }}>
          <FileToSave editorContent={editorContent} />
        </PDFViewer>
      )} */}
    </div>
  );
};

export default App;
