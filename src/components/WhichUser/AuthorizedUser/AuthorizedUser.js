import React, { useState, useEffect } from 'react';
import useS3Files from '../../../hooks/useS3/useS3Files';
import ButtonComponent from '../../Button/Button';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, CircularProgress } from '@mui/material';
import './AuthorizedUser.css';

import config from '../../../config';

const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

const LoggedInUser = ({ user, token, handleLogout, setSelectedTemplate }) => {
  const { fetchFiles } = useS3Files(token);
  const [fetchedFiles, setFetchedFiles] = useState(() => {
    try {
      const cachedData = sessionStorage.getItem('cachedFiles');
      if (cachedData) {
        const { files, timestamp } = JSON.parse(cachedData);
        // If cache is still valid, use it
        if (Date.now() - timestamp < CACHE_TTL) {
          return files;
        }
      }
    } catch (e) {
      console.error("Error reading from sessionStorage:", e);
    }
    return [];
  });
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
  const [loading, setLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState(() => {
    try {
      const cachedData = sessionStorage.getItem('cachedFiles');
      if (cachedData) {
        const { timestamp } = JSON.parse(cachedData);
        return timestamp;
      }
    } catch (e) {
      console.error("Error reading timestamp:", e);
    }
    return 0;
  });

  // Save state to sessionStorage after any changes to showFiles
  useEffect(() => {
    try {
      sessionStorage.setItem('showFilesState', JSON.stringify(showFiles));
    } catch (e) {
      console.error("Error writing to sessionStorage:", e);
    }
  }, [showFiles]);

  // Cache the fetched files
  useEffect(() => {
    if (fetchedFiles.length > 0) {
      try {
        const cacheData = {
          files: fetchedFiles,
          timestamp: lastFetched
        };
        sessionStorage.setItem('cachedFiles', JSON.stringify(cacheData));
      } catch (e) {
        console.error("Error caching files:", e);
      }
    }
  }, [fetchedFiles, lastFetched]);

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
    const fetchFilesData = async (forceRefresh = false) => {
      // If we have recent data and we're not forcing a refresh, skip the fetch
      if (!forceRefresh && fetchedFiles.length > 0 && (Date.now() - lastFetched < CACHE_TTL)) {
        return;
      }
      
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
      if (showFiles && (fetchedFiles.length === 0 || Date.now() - lastFetched > CACHE_TTL)) {
        fetchFilesData();
      }
    }, []);

    const handleFetchFiles = async () => {
      // Toggle visibility regardless of whether we need to fetch
      setShowFiles(prev => !prev);
      
      // Only fetch if needed (empty or stale cache)
      if (fetchedFiles.length === 0 || Date.now() - lastFetched > CACHE_TTL) {
        await fetchFilesData();
      }
    };

    // Function that can be called externally to refresh files (e.g., after saving)
    const refreshFiles = async () => {
      await fetchFilesData(true);
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
    </div>
  );
};

export default LoggedInUser;
