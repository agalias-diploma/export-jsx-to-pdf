import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js"; // controlled editor
import { convertToHTML } from 'draft-convert';
import DOMPurify from 'dompurify';
import { PDFViewer } from '@react-pdf/renderer';

import FileToSave from '../FileToSave';
import ToggleButton from "../Button/Button";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./Editor.css";

const ReactDraftEditor = () => {
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty()
  );
  const [convertedContent, setConvertedContent] = useState(null);

  useEffect(() => {
    let html = convertToHTML(editorState.getCurrentContent());
    setConvertedContent(html);
  }, [editorState]);

  console.log(convertedContent); 

  function createMarkup(html) {
    return {
      __html: DOMPurify.sanitize(html)
    }
  }

  const [editorContent, setEditorContent] = useState(null);
  const [isViewerVisible, setIsViewerVisible] = useState(false);

  const handleContentChange = (content) => {
    setEditorContent(content);
  };

  const toggleViewerVisibility = () => {
    setIsViewerVisible(!isViewerVisible);
  };

  return (
    <div>
      <Editor
        // toolbarOnFocus
        editorState={editorState}
        onEditorStateChange={setEditorState}
        toolbarClassName="toolbar-class"
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbar={{
          options: ['inline', 'blockType']
        }}
      />
      <h4>Preview text:</h4>
      <div
        className="preview"
        dangerouslySetInnerHTML={createMarkup(convertedContent)}>
      </div>
      <ToggleButton
        onClick={toggleViewerVisibility}
        isViewerVisible={isViewerVisible}
      />
      {isViewerVisible && (
        <PDFViewer style={{ width: "100%", height: "100vh" }}>
          <FileToSave editorContent={editorContent} />
        </PDFViewer>
      )}
    </div>
  );
};

export default ReactDraftEditor;