import React from 'react';
import useS3Files from '../../hooks/useS3Files';
import ButtonComponent from '../Button/Button';

const LoggedInUser = ({ user, token, handleLogout }) => {
  const { files, fetchFiles } = useS3Files(token);

  return (
    <div>
      <h1>Welcome, {user?.name || 'User'}</h1>
      {/* We should place login/out button in header, and need to modify Header/Footer  */}
      <button onClick={handleLogout}>Sign Out</button> 
      <ButtonComponent text="Show my S3 files" onClick={fetchFiles} />

      {files.length > 0 && (
        <div>
          <h2>My Files</h2>
          <ul>
            {files.map((file) => (
              <li key={file.key}>
                {file.key} - {file.size} bytes
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LoggedInUser;
