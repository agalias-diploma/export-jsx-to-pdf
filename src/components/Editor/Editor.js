import React, { useState, useEffect, useRef } from "react";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import DOMPurify from "dompurify";
import generatePDF, { Resolution, Margin } from "react-to-pdf";

import ButtonComponent from "../Button/Button";
import InputFileName from "../Input/InputFileName";
import ButtonGroup from "../ButtonGroup/ButtonGroup";
import EditorComponent from "./EditorComponent/EditorComponent";
import PreviewComponent from "../PreviewComponent/PreviewComponent";
import {
  handleDownloadContentAsJS,
  handleDownloadPDF,
} from "../DownloadFunctions/DownloadFunctions";
import { Box } from "@mui/material";
import axios from 'axios'; // Add axios for API requests

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./Editor.css";

const ReactDraftEditor = ({ rawContent, selectedTemplate, setSelectedTemplate }) => {
  const [editorState, setEditorState] = useState(() => {
    if (selectedTemplate) {
      // If template is selected, load it into the editor state
      return EditorState.createWithContent(convertFromRaw(selectedTemplate));
    } else {
      // Otherwise, fall back to the rawContent.js file
      return EditorState.createWithContent(convertFromRaw(JSON.parse(rawContent)));
    }
  });

  const [convertedContentToHTML, setConvertedContentToHTML] = useState("");
  const [filename, setFilename] = useState("");

  useEffect(() => {
    // proceed when state is not null
    if (editorState) {
      // Convert editorState into HTML in order to print data on page
      let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      html = sanitizeHtml(html);

      let styledHtml = html;
      styledHtml = html.replace(
        /<p>/g,
        '<p style="overflow-wrap: break-word; white-space: pre-wrap;">'
      );

      setConvertedContentToHTML(styledHtml);
    }
  }, [editorState]);

  useEffect(() => {
    // Save the current editorState (JSON) to localStorage whenever it changes
    const content = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    localStorage.setItem('selectedTemplate', content);
  }, [editorState]);

  const targetRef = useRef();

  const sanitizeHtml = (html) => {
    return DOMPurify.sanitize(html);
  };

  const handleEditorStateChange = (newState) => {
    // Compare the current editor state with the new state
    if (editorState !== newState) {
      setEditorState(newState);
    }
  };

  const handleFilenameChange = (newFilename) => {
    setFilename(newFilename);
  };

  // Function to save file content to S3 via backend
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
        <InputFileName
          filename={filename}
          onFilenameChange={handleFilenameChange}
        />
      </Box>
      <h3>Expected PDF File</h3>
      <PreviewComponent
        convertedContentToHTML={convertedContentToHTML}
        targetRef={targetRef}
      />
    </div>
  );
};

export default ReactDraftEditor;
