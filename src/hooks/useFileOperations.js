import { useState } from 'react';
import { convertToRaw } from 'draft-js';
import axios from 'axios';

import config from '../config'; 

const useFileOperations = () => {
  const [filename, setFilename] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const handleFilenameChange = (newFilename) => {
    setFilename(newFilename);
  };

  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const saveFileContentToS3 = async (editorState) => {
    const content = convertToRaw(editorState.getCurrentContent());
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("User is not authenticated", "error");
    }

    if (!filename || filename.trim() === "") {
      showToast("Please enter a filename!", "error");
    }

    try {
      const response = await axios.post(
        `${config.apiUrl}/api/s3-save-template`,
        { filename, content },
        { headers: { Authorization: token } }
      );
      
      console.log("File saved successfully", response.data);
      showToast("File saved successfully!", "success");
      
      // Call the global refresh function if it exists
      if (window.refreshFilesData) {
        window.refreshFilesData();
      }
      
      return true;
    } catch (error) {
      handleSaveError(error);
      return false;
    }
  };

  const handleSaveError = (error) => {
    if (error.response) {
      const status = error.response.status;
      const errorMessages = {
        401: "You need to sign in to be able to save templates.",
        409: "File already exists. Please enter a different filename",
        500: "Server error. Please try again later."
      };
      showToast(errorMessages[status] || `Error: ${error.response.data.message || "An unknown error occurred."}`, "error");
    } else if (error.request) {
      showToast("No response from server.", "error");
    } else {
      showToast(`Error: ${error.message}`, "error");
    }
  };

  return { filename, handleFilenameChange, saveFileContentToS3, toast, hideToast };
};

export default useFileOperations;
