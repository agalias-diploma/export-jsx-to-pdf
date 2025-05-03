import React from 'react';
import { Box } from '@mui/material';
import ButtonComponent from '../Button/Button';
import ButtonGroup from '../ButtonGroup/ButtonGroup';

const ActionButtons = ({
  isLoggedIn,
  editorState,
  filename,
  targetRef,
  Resolution,
  Margin,
  generatePDF,
  handleDownloadContentAsJS,
  handleDownloadPDF,
  saveFileContentToS3
}) => (
  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
    <ButtonGroup>
      <ButtonComponent
        onClick={() => handleDownloadContentAsJS(editorState, filename)}
        text="Download as JS"
        color="purple"
      />
      <ButtonComponent
        onClick={() => handleDownloadPDF(targetRef, filename, Resolution, Margin, generatePDF, 'save')}
        text="Download PDF"
        color="cyan"
      />
      {isLoggedIn && (
        <ButtonComponent
          onClick={saveFileContentToS3}
          text="Save template to S3"
          color="orange"
        />
      )}
      <ButtonComponent
        onClick={() => handleDownloadPDF(targetRef, filename, Resolution, Margin, generatePDF, 'open')}
        text="Preview in PDF format"
      />
    </ButtonGroup>
  </Box>
);

export default ActionButtons;
