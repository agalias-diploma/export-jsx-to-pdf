import React, { useState, useEffect } from 'react';
import useS3Files from '../../../hooks/useS3/useS3Files';
import ButtonComponent from '../../Button/Button';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, CircularProgress } from '@mui/material';
import './AuthorizedUser.css';

import config from '../../../config';

const LoggedInUser = ({ user, token, handleLogout, setSelectedTemplate }) => {
  const { fetchFiles } = useS3Files(token);
  const [fetchedFiles, setFetchedFiles] = useState([]); // Local state to store files
  const [showFiles, setShowFiles] = useState(() => {
    try {
      // Use sessionStorage which is simpler and persists only for the current session
      const storedValue = sessionStorage.getItem('showFilesState');
      return storedValue !== null ? JSON.parse(storedValue) : false;
    } catch (e) {
      console.error("Error reading from sessionStorage:", e);
      return false;
    }
  });
  const [loading, setLoading] = useState(false); // State for tracking if files are being loaded
  const [lastFetched, setLastFetched] = useState(0);

  // Save state to sessionStorage after any changes to showFiles
  useEffect(() => {
    try {
      sessionStorage.setItem('showFilesState', JSON.stringify(showFiles));
    } catch (e) {
      console.error("Error writing to sessionStorage:", e);
    }
  }, [showFiles]);

  const handleSelectTemplate = async (templateKey) => {
    setLoading(true);
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
  
      try {
        const jsonData = JSON.parse(sanitizedData);
        console.log("Successfully parsed JSON:", jsonData);
  
        localStorage.setItem('selectedTemplate', JSON.stringify(jsonData));

        // Update React state to trigger re-render of the editor
        setSelectedTemplate(jsonData);
  
      } catch (jsonError) {
        console.error("JSON Parse error:", jsonError, sanitizedData, "\n It's probably a template which is not made by this Editor!");
      }
    } catch (error) {
      console.error("Error fetching template:", error);
    } finally {
      setLoading(false);
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

    // Function to only fetch files without toggling visibility
    const fetchFilesData = async () => {
      setLoading(true);
      try {
        const fetchedData = await fetchFiles();
        setFetchedFiles(fetchedData);
        setLastFetched(Date.now());
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      if (showFiles && (fetchedFiles.length === 0)) {
        fetchFilesData();
      }
    }, []);

  const handleFetchFiles = async () => {
    // Fetch only if we need to
    if (fetchedFiles.length === 0) {
      await fetchFilesData();
    }
    setShowFiles(prev => !prev);
  };

    // Function that can be called externally to refresh files (e.g., after saving)
    const refreshFiles = async () => {
      await fetchFilesData();
    };
  
    // Expose the refresh function
    useEffect(() => {
      window.refreshFilesData = refreshFiles;
      
      return () => {
        delete window.refreshFilesData;
      };
    }, []);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '15px' }}>
        <ButtonComponent 
          text={showFiles ? "Hide saved templates" : "Show saved templates"} 
          onClick={handleFetchFiles}
          sx={{ 
            width: "250px",
          }}
        />
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
                        color="error"
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
      {/* <Collapse in={showFiles} timeout="auto" unmountOnExit>
        <div style={{ marginTop: '15px', fontSize: '12px', color: 'gray', textAlign: 'right' }}>
          Note: This data might not be up-to-date.
        </div>
      </Collapse> */}
    </div>
  );
};

export default LoggedInUser;
