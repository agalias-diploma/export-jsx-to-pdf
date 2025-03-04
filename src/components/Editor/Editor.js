import React, { useState, useEffect, useRef } from "react";
import {
  convertToRaw,
} from "draft-js";
import generatePDF, { Resolution, Margin } from "react-to-pdf";

import ButtonComponent from "../Button/Button";
import InputFileName from "../Input/InputFileName";
import ButtonGroup from "../ButtonGroup/ButtonGroup";
import EditorComponent from "./EditorComponent/EditorComponent";
import {
  handleDownloadContentAsJS,
  handleDownloadPDF,
} from "../DownloadFunctions/DownloadFunctions";
import { Box } from "@mui/material";
import axios from 'axios'; // Add axios for API requests

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./Editor.css";

const ReactDraftEditor = ({ rawContent, selectedTemplate, setSelectedTemplate, editorState, setEditorState }) => {
  const targetRef = useRef();

  const [filename, setFilename] = useState("");

  // Save the current editorState (JSON) to localStorage whenever it changes
  useEffect(() => {
    const content = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    localStorage.setItem('selectedTemplate', content);
  }, [editorState]);

  // Compare the current editor state with the new state
  const handleEditorStateChange = (newState) => {
    if (editorState !== newState) {
      setEditorState(newState);
    }
  };

  // Function to handle filename change
  const handleFilenameChange = (newFilename) => {
    setFilename(newFilename);
  };

  // Function to save file content to S3 via backend (API request)
  // We should move it out from this component somewhere else
  const saveFileContentToS3 = async () => {
    const content = convertToRaw(editorState.getCurrentContent());
    const token = localStorage.getItem("token");

    if (!token) {
      alert("User is not authenticated");
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/s3-save-template',
        {
          filename,
          content
        },
        {
          headers: { Authorization: token }
        }
      );
      console.log('File saved successfully', response.data);
    // This is really bad error handling, we should improve it
    } catch (error) {
      console.error('Error saving file to S3:', error);
      if (error.response) {
        if (error.response.status === 401) {
          alert('You need to sign into to be able to save templates.');
        } else if (error.response.status === 409) {
          alert('File already exists. Please enter a different filename');
        } else if (error.response.status === 401) {
          alert("Unauthorized. Please log in again.");
        } else if (error.response.status === 500) {
          alert("Server error. Please try again later.");
        } else {
          alert(`Error: ${error.response.data.message || 'An unknown error occurred.'}`);
        }
      } else if (error.request) {
        alert('No response from server.');
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <EditorComponent
        editorState={editorState}
        onEditorStateChange={handleEditorStateChange}
      />
      <Box 
        display="flex" 
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <ButtonGroup>
          <ButtonComponent
            onClick={() => handleDownloadContentAsJS(editorState, filename)}
            text="Download as JS"
          />
          <ButtonComponent
            onClick={() => handleDownloadPDF(targetRef, filename, Resolution, Margin, generatePDF)} 
            text="Download PDF"
          />
          {/* Add functionality to block this button if user is unauthorized */}
          <ButtonComponent
            onClick={saveFileContentToS3}
            text="Save template to S3"
          />
        </ButtonGroup>
        {/* We should move input field from here to top level in App.js */}
        <InputFileName
          filename={filename}
          onFilenameChange={handleFilenameChange}
        />
      </Box>
    </div>
  );
};

export default ReactDraftEditor;
