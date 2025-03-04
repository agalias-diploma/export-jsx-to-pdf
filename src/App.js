import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";

import { Box } from "@mui/material";

import useAuth from "./hooks/useAuth";
import usePreviewComponent from "./hooks/usePreviewComponent";
import useFileOperations from "./hooks/useFileOperations";

import Editor from "./components/Editor/Editor";
import Header from "./components/Header/Header";
import PreviewComponent from "./components/PreviewComponent/PreviewComponent";
import InputFileName from "./components/Input/InputFileName";
import ActionButtons from "./components/ButtonGroup/ActionButtons";
import AuthorizedUser from "./components/WhichUser/AuthorizedUser/AuthorizedUser";
import UnauthorizedUser from "./components/WhichUser/UnauthorizedUser/UnauthorizedUser";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import rawContent from "./data/rawContent";

import generatePDF, { Resolution, Margin } from "react-to-pdf";
import {
  handleDownloadContentAsJS,
  handleDownloadPDF,
} from "./hooks/DownloadFunctions/DownloadFunctions";

const App = () => {
  const { isLoggedIn, user, token, loading, handleLogin, handleLogout } =
    useAuth();
  const targetRef = useRef();
  const { filename, handleFilenameChange, saveFileContentToS3 } = useFileOperations();

  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    const savedTemplate = localStorage.getItem("selectedTemplate");
    return savedTemplate ? JSON.parse(savedTemplate) : null;
  });

  // Manage editorState on top level
  const [editorState, setEditorState] = useState(() => {
    if (selectedTemplate) {
      return EditorState.createWithContent(convertFromRaw(selectedTemplate));
    }
    return EditorState.createWithContent(
      convertFromRaw(JSON.parse(rawContent))
    );
  });

  // Call usePreviewComponent hook to convert content to HTML
  const { convertedContentToHTML } = usePreviewComponent(editorState);

  useEffect(() => {
    if (selectedTemplate) {
      // If a template is selected, save it to localStorage
      localStorage.setItem(
        "selectedTemplate",
        JSON.stringify(selectedTemplate)
      );
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
          <Editor
            rawContent={rawContent}
            editorState={editorState}
            setEditorState={setEditorState}
            filename={filename}
            saveFileContentToS3={saveFileContentToS3}
          />
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <InputFileName
              filename={filename}
              onFilenameChange={handleFilenameChange}
            />
          </Box>
          <ActionButtons
            isLoggedIn={isLoggedIn}
            editorState={editorState}
            filename={filename}
            targetRef={targetRef}
            Resolution={Resolution}
            Margin={Margin}
            generatePDF={generatePDF}
            handleDownloadContentAsJS={handleDownloadContentAsJS}
            handleDownloadPDF={handleDownloadPDF}
            saveFileContentToS3={() => saveFileContentToS3(editorState)}
          />
          <PreviewComponent
            convertedContentToHTML={convertedContentToHTML}
            targetRef={targetRef}
          />
        </>
      ) : (
        <>
          <AuthorizedUser
            user={user}
            token={token}
            handleLogout={handleLogout}
            setSelectedTemplate={setSelectedTemplate}
          />
          <Editor
            rawContent={rawContent}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            editorState={editorState}
            setEditorState={setEditorState}
            filename={filename}
            saveFileContentToS3={saveFileContentToS3}
          />
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <InputFileName
              filename={filename}
              onFilenameChange={handleFilenameChange}
            />
          </Box>
          <ActionButtons
            isLoggedIn={isLoggedIn}
            editorState={editorState}
            filename={filename}
            targetRef={targetRef}
            Resolution={Resolution}
            Margin={Margin}
            generatePDF={generatePDF}
            handleDownloadContentAsJS={handleDownloadContentAsJS}
            handleDownloadPDF={handleDownloadPDF}
            saveFileContentToS3={() => saveFileContentToS3(editorState)}
          />
          <PreviewComponent
            convertedContentToHTML={convertedContentToHTML}
            targetRef={targetRef}
          />
        </>
      )}
    </div>
  );
};

export default App;
