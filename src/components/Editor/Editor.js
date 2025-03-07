import React, { useEffect } from "react";
import { convertToRaw } from "draft-js";

import EditorComponent from "./EditorComponent/EditorComponent";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./Editor.css";

const ReactDraftEditor = ({
  rawContent,
  selectedTemplate,
  setSelectedTemplate,
  editorState,
  setEditorState,
  filename,
  saveFileContentToS3,
}) => {

  // Save the current editorState (JSON) to localStorage whenever it changes
  useEffect(() => {
    const content = JSON.stringify(
      convertToRaw(editorState.getCurrentContent())
    );
    localStorage.setItem("selectedTemplate", content);
  }, [editorState]);

  // Compare the current editor state with the new state
  const handleEditorStateChange = (newState) => {
    if (editorState !== newState) {
      setEditorState(newState);
    }
  };

  return (
    <div>
      <EditorComponent
        editorState={editorState}
        onEditorStateChange={handleEditorStateChange}
      />
    </div>
  );
};

export default ReactDraftEditor;
