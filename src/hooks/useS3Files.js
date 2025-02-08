import { useState } from 'react';

const useS3Files = (token) => {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/s3-files', {
        method: 'GET',
        headers: { Authorization: token },
      });

      if (!response.ok) throw new Error('Failed to fetch files');

      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  return { files, fetchFiles };
};

export default useS3Files;
