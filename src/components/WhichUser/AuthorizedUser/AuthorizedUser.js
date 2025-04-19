import React, { useState } from 'react';
import useS3Files from '../../../hooks/useS3/useS3Files';
import ButtonComponent from '../../Button/Button';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, CircularProgress } from '@mui/material';
import './AuthorizedUser.css';

import config from '../../../config';

const LoggedInUser = ({ user, token, handleLogout }) => {
  const { fetchFiles } = useS3Files(token);
  const [fetchedFiles, setFetchedFiles] = useState([]); // Local state to store files
  const [showFiles, setShowFiles] = useState(false); // State for controlling visibility of the table and note
  const [loading, setLoading] = useState(false); // State for tracking if files are being loaded
  const [lastFetched, setLastFetched] = useState(Date.now()); // Track the last fetch time

  // Polling interval (30 seconds)
  const pollInterval = 30000;

  // const checkForNewFiles = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:3000/api/s3-check-for-new-files?userId=${user.id}`);
  //     const data = await response.json();
  //     if (data.hasNewFiles) {
  //       setFetchedFiles(await fetchFiles()); // Fetch and update files if new ones are available
  //     }
  //   } catch (error) {
  //     console.error('Error checking for new files:', error);
  //   }
  // };

  const handleSelectTemplate = async (templateKey) => {
    try {
        const response = await fetch(`${config.apiUrl}/api/s3-file-content?fileKey=${templateKey}`, {
        //const response = await fetch(`https://api-stage.agalias-project.online/api/s3-file-content?fileKey=${templateKey}`, {
        method: 'GET',
        headers: { Authorization: token },
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error making request to backend on /s3-file-content endpoint:", errorData);
        return;
      }
  
      const textData = await response.text(); // Get the raw response text
  
      // Remove the JavaScript code at the start and end to get the JSON content
      const sanitizedData = textData.replace(/^const obj = `/, '').replace(/`;\s*export default obj;$/, '');
  
      // Try to parse the sanitized string as JSON
      try {
        const jsonData = JSON.parse(sanitizedData);
        console.log("Successfully parsed JSON:", jsonData);
  
        // Save the parsed JSON to localStorage
        localStorage.setItem('selectedTemplate', JSON.stringify(jsonData));
  
      } catch (jsonError) {
        console.error("JSON Parse error:", jsonError, sanitizedData, "\n It's probably a template which is not made by this Editor!");
      }
    } catch (error) {
      console.error("Error fetching template:", error);
    }
  };

  const handleDeleteFile = async (fileKey) => {
    try {
        const response = await fetch(`${config.apiUrl}/api/s3-delete-file?fileKey=${fileKey}`, {
        //const response = await fetch(`https://api-stage.agalias-project.online/api/s3-delete-file?fileKey=${fileKey}`, {
        method: 'DELETE',
        headers: { Authorization: token },
      });
  
      if (response.ok) {
        setFetchedFiles(fetchedFiles.filter(file => file.key !== fileKey)); // Remove the file from the table
      } else {
        const errorData = await response.json();
        alert(`Error deleting file: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file. Please try again.");
    }
  };

  // we should get rid of this logic and trigger call on route get /api/s3-files

  // Polling files check every 30 seconds
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     checkForNewFiles();
  //   }, pollInterval);
    
  //   return () => clearInterval(intervalId);
  // }, [user.id]);

  // Function to handle fetching files
  const handleFetchFiles = async () => {
    if (fetchedFiles.length === 0 || Date.now() - lastFetched > pollInterval) {
      setLoading(true); // Start loading
      try {
        const fetchedData = await fetchFiles();
        setFetchedFiles(fetchedData); // Store the fetched files in state
        setLastFetched(Date.now()); // Update last fetch time
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false); // Stop loading after the request is complete
      }
    }
    setShowFiles((prevState) => !prevState); // Toggle the visibility of the table and note
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* remove it later */}
      <h1>Welcome, {user?.name || 'User'}</h1>

      <div style={{ marginBottom: '15px' }}>
        <Button 
          variant="contained" 
          color="error" 
          onClick={handleLogout} 
          className="signOutButton"
        >
          Sign Out
        </Button>
        {/* Add functionality to block this button when user unathorized. We should probably move out this too. */}
        <ButtonComponent text="Show my S3 files" onClick={handleFetchFiles} />

        {loading && <CircularProgress size={24} style={{ marginLeft: '10px' }} />}
      </div>

      <Collapse in={showFiles} timeout="auto" unmountOnExit>
        {fetchedFiles.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Filename</TableCell>
                  <TableCell>Size (bytes)</TableCell>
                  <TableCell>Last Modified</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fetchedFiles.filter(file => file.size > 0).map((file) => (
                  <TableRow key={file.key}>
                    <TableCell>{file.key}</TableCell>
                    <TableCell>{file.size}</TableCell>
                    <TableCell>{new Date(file.lastModified).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSelectTemplate(file.key)}
                      >
                        Select
                      </Button>
                      <Button
                        variant="contained"
                        color="error" // Red delete button
                        onClick={() => handleDeleteFile(file.key)}
                        style={{ marginLeft: '10px' }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Collapse>
      <Collapse in={showFiles} timeout="auto" unmountOnExit>
        <div style={{ marginTop: '15px', fontSize: '12px', color: 'gray', textAlign: 'right' }}>
          Note: This data might not be up-to-date.
        </div>
      </Collapse>
    </div>
  );
};

export default LoggedInUser;
