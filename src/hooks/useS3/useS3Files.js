import config from '../../config';

const useS3Files = (token) => {
  const fetchFiles = async () => {
    try {
        const response = await fetch(`${config.apiUrl}/api/s3-files`, {
        //const response = await fetch(`https://api-stage.agalias-project.online/api/s3-files`, {
        method: 'GET',
        headers: { Authorization: token },
      });

      if (!response.ok) throw new Error('Failed to fetch files');

      const data = await response.json();
      
      // Assuming data has a `files` array
      if (Array.isArray(data.files)) {
        return data.files; // Return the array of files
      } else {
        console.error('Fetched data is not an array:', data);
        return []; // Return an empty array if data is not as expected
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      return []; // Return an empty array in case of an error
    }
  };

  return { fetchFiles };
};

export default useS3Files;
