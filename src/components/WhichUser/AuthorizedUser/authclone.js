// src/components/LoggedInUser/LoggedInUser.js
import React, { useState } from 'react';
import useS3Files from '../../../hooks/useS3Files';
import ButtonComponent from '../../Button/Button';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse } from '@mui/material';
import './AuthorizedUser.css'; // Import the CSS file

const LoggedInUser = ({ user, token, handleLogout }) => {
  const { fetchFiles } = useS3Files(token);

  // Initialize files as an empty array to avoid undefined errors
  const [files, setFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);

  // Toggle the visibility of the table
  const toggleFiles = async () => {
    if (files.length === 0) {
      // If files are not already fetched, fetch them
      try {
        const fetchedFiles = await fetchFiles();
        if (Array.isArray(fetchedFiles)) {
          setFiles(fetchedFiles); // Store the fetched files in local state
        } else {
          console.error('Fetched data is not an array:', fetchedFiles);
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    }
    setShowFiles((prevState) => !prevState); // Toggle the visibility of the table
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome, {user?.name || 'User'}</h1>

      <div style={{ marginBottom: '15px' }}>
        <Button 
          variant="contained" 
          color="error" // Red color for sign out
          onClick={handleLogout}
          className="signOutButton" // Apply the class for styling
        >
          Sign Out
        </Button>
        <ButtonComponent text="Show my S3 files" onClick={toggleFiles} />
      </div>

      {/* Use Collapse to animate the table sliding in and out */}
      <Collapse in={showFiles} timeout="auto" unmountOnExit>
        {files.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Filename</TableCell>
                  <TableCell>Size (bytes)</TableCell>
                  <TableCell>Last Modified</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.key}>
                    <TableCell>{file.key}</TableCell>
                    <TableCell>{file.size}</TableCell>
                    <TableCell>{new Date(file.lastModified).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Collapse>
    </div>
  );
};

export default LoggedInUser;
