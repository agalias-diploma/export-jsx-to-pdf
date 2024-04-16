import * as React from 'react';
import "../../App.css";
import "./InputFileName.css";
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import OutlinedInput from '@mui/material/OutlinedInput';

// const ariaLabel = { 'aria-label': 'description' };

const InputFileName = ({ filename, onFilenameChange }) => {
  const handleFilenameChange = (e) => {
    onFilenameChange(e.target.value);
  };

  return (
    // <input
    //   type="text"
    //   placeholder="Enter file name"
    //   value={filename}
    //   onChange={handleFilenameChange}
    // />
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1 },
      }}
      noValidate
      autoComplete="off"
    >
      <OutlinedInput type="text" color="primary" placeholder="Enter file name" value={filename} onChange={handleFilenameChange} />
    </Box>
  );
};

export default InputFileName;