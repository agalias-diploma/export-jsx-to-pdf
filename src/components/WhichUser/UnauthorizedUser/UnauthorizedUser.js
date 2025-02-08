import React from 'react';
import { Button } from '@mui/material';

const UnauthorizedUser = ({ handleLogin }) => {
  return (
    <div>
      <Button 
        variant="contained" 
        onClick={handleLogin}
        sx={{ 
          padding: '12px 24px', 
          marginTop: '20px', 
          backgroundColor: 'green', // Green color
          '&:hover': {
            backgroundColor: 'darkgreen', // Darker green on hover
          }
        }}
      >
        Sign In with Google
      </Button>
    </div>
  );
};

export default UnauthorizedUser;
