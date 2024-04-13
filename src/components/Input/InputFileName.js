import React from "react";
import "../../App.css";
import "./InputFileName.css";

const InputFileName = ({ filename, onFilenameChange }) => {
  const handleFilenameChange = (e) => {
    onFilenameChange(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Enter file name"
      value={filename}
      onChange={handleFilenameChange}
    />
  );
};

export default InputFileName;