import React, { useState, useEffect } from 'react';
import useS3Files from '../../../hooks/useS3Files';
import ButtonComponent from '../../Button/Button';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, CircularProgress } from '@mui/material';
import './AuthorizedUser.css';

const LoggedInUser = ({ user, token, handleLogout }) => {
  const { fetchFiles } = useS3Files(token);
  const [fetchedFiles, setFetchedFiles] = useState([]); // Local state to store files
  const [showFiles, setShowFiles] = useState(false); // State for controlling visibility of the table and note
  const [loading, setLoading] = useState(false); // State for tracking if files are being loaded
  const [lastFetched, setLastFetched] = useState(Date.now()); // Track the last fetch time
  const [selectedTemplate, setSelectedTemplate] = useState(localStorage.getItem('selectedTemplate') || ''); // Load from storage

  // Polling interval (30 seconds)
  const pollInterval = 30000;

  const checkForNewFiles = async () => {
    try {
      const response = await fetch(`/api/check-for-new-files?userId=${user.id}`);
      const data = await response.json();
      if (data.hasNewFiles) {
        setFetchedFiles(await fetchFiles()); // Fetch and update files if new ones are available
      }
    } catch (error) {
      console.error('Error checking for new files:', error);
    }
  };

  // Handle template selection
  const handleSelectTemplate = async (templateKey) => {
    try {
      // Call API to set selected template
      const response = await fetch('/api/s3-select-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ templateKey }),
      });

      if (response.ok) {
        setSelectedTemplate(templateKey); // Update state
        localStorage.setItem('selectedTemplate', templateKey); // Save to local storage
      } else {
        console.error('Failed to select template');
      }
    } catch (error) {
      console.error('Error selecting template:', error);
    }
  };

  // Polling files check every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      checkForNewFiles();
    }, pollInterval);
    
    return () => clearInterval(intervalId);
  }, [user.id]);

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
                  <TableCell>Action</TableCell> {/* New column for selecting template */}
                </TableRow>
              </TableHead>
              <TableBody>
                {fetchedFiles.map((file) => (
                  <TableRow key={file.key}>
                    <TableCell>{file.key}</TableCell>
                    <TableCell>{file.size}</TableCell>
                    <TableCell>{new Date(file.lastModified).toLocaleString()}</TableCell>
                    <TableCell>
                      {/* Only show the button if it's not a folder (i.e., size > 0) */}
                      {file.size > 0 && selectedTemplate !== file.key ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleSelectTemplate(file.key)}
                        >
                          Select
                        </Button>
                      ) : (
                        // Render a label for directories (or leave it empty)
                        file.size === 0 && <span>Folder</span>
                      )}
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
