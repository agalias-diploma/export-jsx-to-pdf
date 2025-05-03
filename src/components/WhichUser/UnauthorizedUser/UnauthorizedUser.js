import React from 'react';
import ButtonComponent from '../../Button/Button';

const UnauthorizedUser = ({ handleLogin }) => {
  return (

    <div style={{ marginBottom: '15px', padding: '20px' }}>
      <ButtonComponent 
        text="Sign In with Google"
        color="success" // Use success for green
        onClick={handleLogin}
      />
    </div>
  );
};

export default UnauthorizedUser;
