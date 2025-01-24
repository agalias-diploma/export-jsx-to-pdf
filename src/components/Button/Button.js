import React from "react";
import "../../App.css";

import Button from '@mui/material/Button';

const ButtonComponent = ({ onClick, children, text }) => {
  return (
    <Button variant="contained" onClick={onClick}>
      {text || children}
    </Button>
  );
};

export default ButtonComponent;