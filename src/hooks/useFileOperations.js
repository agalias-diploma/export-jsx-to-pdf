import { useState } from 'react';
import { convertToRaw } from 'draft-js';
import axios from 'axios';

const useFileOperations = () => {
  const [filename, setFilename] = useState("");

  const handleFilenameChange = (newFilename) => {
    setFilename(newFilename);
  };

  const saveFileContentToS3 = async (editorState) => {
    const content = convertToRaw(editorState.getCurrentContent());
    const token = localStorage.getItem("token");

    if (!token) {
      alert("User is not authenticated");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/s3-save-template",
        { filename, content },
        { headers: { Authorization: token } }
      );
      console.log("File saved successfully", response.data);
    } catch (error) {
      handleSaveError(error);
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
      alert(errorMessages[status] || `Error: ${error.response.data.message || "An unknown error occurred."}`);
    } else if (error.request) {
      alert("No response from server.");
    } else {
      alert(`Error: ${error.message}`);
    }
  };

  return { filename, handleFilenameChange, saveFileContentToS3 };
};

export default useFileOperations;
